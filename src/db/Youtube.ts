'use server'

import prisma from '@/lib/prisma/prisma'
import { unstable_cache } from 'next/cache'
import {
	Playlist,
	YoutubeDetail,
	YoutubeSearchQuery,
} from '@/types/YoutubeTypes'

export const getAccessToken = async () => {
	async function getAccessToken() {
		try {
			const token = await prisma.youtubeAuth.findFirst()
			return token
		} catch (error) {
			throw error
		}
	}
	const token = unstable_cache(getAccessToken, [], {
		tags: ['youtube-token'],
	})
	const result = await token()
	return result
}

export const upsertAccessToken = async ({
	tokens,
}: {
	tokens: {
		id: string
		email?: string
		access_token: string
		refresh_token: string
		expiry_date: string
	}
}) => {
	try {
		await prisma.youtubeAuth.upsert({
			where: { google_id: tokens.id },
			update: {
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
				token_expiry: tokens.expiry_date
					? new Date(tokens.expiry_date)
					: new Date(),
			},
			create: {
				google_id: tokens.id,
				email: tokens.email || '',
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
				token_expiry: tokens.expiry_date
					? new Date(tokens.expiry_date)
					: new Date(),
			},
		})
	} catch (error) {
		throw error
	}
}

export const createPlaylist = async (playlist: Playlist[]) => {
	try {
		for (const item of playlist) {
			const playlist = await prisma.playlist.upsert({
				where: { playlistId: item.playlistId },
				update: {
					title: item.title,
					link: item.link,
					liveDate: item.liveDate,
				},
				create: {
					playlistId: item.playlistId,
					title: item.title,
					link: item.link,
					liveDate: item.liveDate,
				},
			})

			for (const video of item.videos) {
				await prisma.video.upsert({
					where: { videoId: video.videoId },
					update: {
						title: video.title,
						link: video.link,
						playlistId: playlist.playlistId,
						liveDate: video.liveDate,
					},
					create: {
						videoId: video.videoId,
						title: video.title,
						link: video.link,
						liveDate: video.liveDate,
						playlistId: playlist.playlistId,
					},
				})
			}
		}
	} catch (error) {
		throw error
	}
}

export const getPlaylist = async () => {
	async function getPlaylist() {
		try {
			const playlist = await prisma.playlist.findMany({
				include: {
					videos: true,
				},
			})
			return playlist
		} catch (error) {
			throw error
		}
	}
	const playlist = unstable_cache(getPlaylist, [], {
		tags: ['youtube'],
	})
	const result = await playlist()
	return result
}

export async function searchYoutubeDetails(
	query: YoutubeSearchQuery,
): Promise<{ results: YoutubeDetail[]; totalCount: number }> {
	const { liveOrBand, bandName, liveName, tag, sort, page, videoPerPage } =
		query

	// page と videoPerPage が数値であることを保証
	const pageNumber = Number(page) || 1
	const videoPerPageNumber = Number(videoPerPage) || 10

	// .env から特別なIDを取得
	const MOTETAIZU_PLAYLIST_ID = process.env.MOTETAIZU_PLAYLIST_ID
	const MOTETAIZU_VIDEO_ID = process.env.MOTETAIZU_VIDEO_ID

	// 特別な条件: liveName または bandName が "マーシャル" または "Marshall" の場合
	const isSpecialCase =
		liveName === 'マーシャル' ||
		liveName === 'Marshall' ||
		bandName === 'マーシャル' ||
		bandName === 'Marshall'

	let results: YoutubeDetail[] = []
	let totalCount = 0

	if (liveOrBand === 'live') {
		const [playlists, count] = await Promise.all([
			prisma.playlist.findMany({
				where: {
					// 特別な条件の場合、playlistId が MOTETAIZU_PLAYLIST_ID と一致するもののみを取得
					...(isSpecialCase
						? { playlistId: MOTETAIZU_PLAYLIST_ID }
						: {
								AND: [
									liveName && liveName !== ''
										? { title: { contains: liveName } }
										: {},
									bandName && bandName !== ''
										? {
												videos: {
													some: {
														title: { contains: bandName },
													},
												},
											}
										: {},
									tag && !(tag.length === 1 && tag[0] === '') && tag.length > 0
										? {
												tags: {
													hasSome: tag,
												},
											}
										: {},
									// 通常の条件の場合、playlistId が MOTETAIZU_PLAYLIST_ID と一致しないものを取得
									{ NOT: { playlistId: MOTETAIZU_PLAYLIST_ID } },
								],
							}),
				},
				include: {
					videos: true,
				},
				orderBy: {
					liveDate: sort === 'new' ? 'desc' : 'asc',
				},
				skip: (pageNumber - 1) * videoPerPageNumber,
				take: videoPerPageNumber,
			}),
			prisma.playlist.count({
				where: {
					// 特別な条件の場合、playlistId が MOTETAIZU_PLAYLIST_ID と一致するもののみをカウント
					...(isSpecialCase
						? { playlistId: MOTETAIZU_PLAYLIST_ID }
						: {
								AND: [
									liveName && liveName !== ''
										? { title: { contains: liveName } }
										: {},
									bandName && bandName !== ''
										? {
												videos: {
													some: {
														title: { contains: bandName },
													},
												},
											}
										: {},
									tag && !(tag.length === 1 && tag[0] === '') && tag.length > 0
										? {
												tags: {
													hasSome: tag,
												},
											}
										: {},
									// 通常の条件の場合、playlistId が MOTETAIZU_PLAYLIST_ID と一致しないものをカウント
									{ NOT: { playlistId: MOTETAIZU_PLAYLIST_ID } },
								],
							}),
				},
			}),
		])

		results = playlists.map((playlist) => ({
			id: playlist.playlistId,
			title: playlist.title,
			link: playlist.link,
			tags: playlist.tags,
			liveDate: playlist.liveDate,
			liveOrBand: 'live',
			playlistId: undefined,
			playlistTitle: undefined,
			videoId: playlist.videos[0].videoId,
		}))
		totalCount = count
	} else if (liveOrBand === 'band') {
		const [videos, count] = await Promise.all([
			prisma.video.findMany({
				where: {
					// 特別な条件の場合、videoId が MOTETAIZU_VIDEO_ID と一致するもののみを取得
					...(isSpecialCase
						? { videoId: MOTETAIZU_VIDEO_ID }
						: {
								AND: [
									bandName && bandName !== ''
										? { title: { contains: bandName } }
										: {},
									liveName && liveName !== ''
										? {
												playlist: {
													title: { contains: liveName },
												},
											}
										: {},
									tag && !(tag.length === 1 && tag[0] === '') && tag.length > 0
										? {
												playlist: {
													tags: {
														hasSome: tag,
													},
												},
											}
										: {},
									// 通常の条件の場合、videoId が MOTETAIZU_VIDEO_ID と一致しないものを取得
									{ NOT: { videoId: MOTETAIZU_VIDEO_ID } },
								],
							}),
				},
				include: {
					playlist: true,
				},
				orderBy: {
					liveDate: sort === 'new' ? 'desc' : 'asc',
				},
				skip: (pageNumber - 1) * videoPerPageNumber,
				take: videoPerPageNumber,
			}),
			prisma.video.count({
				where: {
					// 特別な条件の場合、videoId が MOTETAIZU_VIDEO_ID と一致するもののみをカウント
					...(isSpecialCase
						? { videoId: MOTETAIZU_VIDEO_ID }
						: {
								AND: [
									bandName && bandName !== ''
										? { title: { contains: bandName } }
										: {},
									liveName && liveName !== ''
										? {
												playlist: {
													title: { contains: liveName },
												},
											}
										: {},
									tag && !(tag.length === 1 && tag[0] === '') && tag.length > 0
										? {
												playlist: {
													tags: {
														hasSome: tag,
													},
												},
											}
										: {},
									// 通常の条件の場合、videoId が MOTETAIZU_VIDEO_ID と一致しないものをカウント
									{ NOT: { videoId: MOTETAIZU_VIDEO_ID } },
								],
							}),
				},
			}),
		])

		results = videos.map((video) => ({
			id: video.videoId,
			title: video.title,
			link: video.link,
			tags: video.tags,
			liveDate: video.liveDate,
			liveOrBand: 'band',
			playlistId: video.playlistId,
			playlistTitle: video.playlist.title,
		}))
		totalCount = count
	}

	return { results, totalCount }
}
