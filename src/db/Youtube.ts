'use server'

import prisma from '@/lib/prisma/prisma'
import { unstable_cache } from 'next/cache'
import {
	Playlist,
	YoutubeDetail,
	YoutubeSearchQuery,
	liveOrBand,
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

export const createPlaylistBatch = async (playlists: Playlist[]) => {
	const createPlaylistBatch = async (
		playlists: Playlist[],
		batchSize: number,
	) => {
		for (let i = 0; i < playlists.length; i += batchSize) {
			const batch = playlists.slice(i, i + batchSize)
			await prisma.$transaction(async (prisma) => {
				for (const playlist of batch) {
					await prisma.playlist.upsert({
						where: { playlistId: playlist.playlistId },
						update: {
							title: playlist.title,
							link: playlist.link,
							liveDate: playlist.liveDate,
						},
						create: {
							playlistId: playlist.playlistId,
							title: playlist.title,
							link: playlist.link,
							liveDate: playlist.liveDate,
						},
					})

					for (const video of playlist.videos) {
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
			})
		}
	}

	const batchSize = 3
	await createPlaylistBatch(playlists, batchSize)
}

export const getPlaylistById = async (id: string) => {
	async function getPlaylistById() {
		try {
			const playlist = await prisma.playlist.findFirst({
				where: { playlistId: id },
				include: {
					videos: true,
				},
			})
			return playlist
		} catch (error) {
			throw error
		}
	}
	const playlist = unstable_cache(getPlaylistById, [id], {
		tags: ['youtube', `playlist-${id}`],
	})
	const result = await playlist()
	return result
}

export const getVideoById = async (id: string) => {
	async function getVideoById() {
		try {
			const video = await prisma.video.findFirst({
				where: { videoId: id },
				include: {
					playlist: true,
				},
			})
			return video
		} catch (error) {
			throw error
		}
	}
	const video = unstable_cache(getVideoById, [id], {
		tags: ['youtube', `video-${id}`],
	})
	const result = await video()
	return result
}

export async function searchYoutubeDetails(
	query: YoutubeSearchQuery,
): Promise<{ results: YoutubeDetail[]; totalCount: number }> {
	try {
		const { liveOrBand, bandName, liveName, tag, sort, page, videoPerPage } =
			query

		const pageNumber = Number(page) || 1
		const videoPerPageNumber = Number(videoPerPage) || 10
		const MOTETAIZU_PLAYLIST_ID = process.env.MOTETAIZU_PLAYLIST_ID
		const MOTETAIZU_VIDEO_ID = process.env.MOTETAIZU_VIDEO_ID
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
										tag &&
										!(tag.length === 1 && tag[0] === '') &&
										tag.length > 0
											? {
													tags: {
														hasSome: tag,
													},
												}
											: {},
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
										tag &&
										!(tag.length === 1 && tag[0] === '') &&
										tag.length > 0
											? {
													tags: {
														hasSome: tag,
													},
												}
											: {},
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
										tag &&
										!(tag.length === 1 && tag[0] === '') &&
										tag.length > 0
											? {
													tags: {
														hasSome: tag,
													},
												}
											: {},
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
										tag &&
										!(tag.length === 1 && tag[0] === '') &&
										tag.length > 0
											? {
													tags: {
														hasSome: tag,
													},
												}
											: {},
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
	} catch (error) {
		throw error
	}
}

export const getPlaylist = async () => {
	async function getPlaylist() {
		try {
			const playlists = await prisma.playlist.findMany({
				include: {
					videos: true,
				},
			})
			return playlists
		} catch (error) {
			throw error
		}
	}
	const playlists = unstable_cache(getPlaylist, [], {
		tags: ['youtube'],
	})
	const result = await playlists()
	return result
}

export const updateTags = async ({
	id,
	tags,
	liveOrBand,
}: {
	id: string // playlistId or videoId
	tags: string[] // 既存のtagを含めて全てのtagを更新する、新規のtagは配列の最後に追加する
	liveOrBand: liveOrBand
}): Promise<void> => {
	try {
		if (liveOrBand === 'live') {
			await prisma.playlist.update({
				where: { playlistId: id },
				data: {
					tags: tags,
				},
			})
		} else if (liveOrBand === 'band') {
			await prisma.video.update({
				where: { videoId: id },
				data: {
					tags: tags,
				},
			})
		}
	} catch (error) {
		throw error
	}
}
