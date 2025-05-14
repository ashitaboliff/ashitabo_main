'use server'

import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import {
	Playlist,
	YoutubeDetail,
	YoutubeSearchQuery,
	liveOrBand,
} from '@/features/video/types'

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
	try {
		// 処理対象のプレイリストIDとビデオIDを抽出
		const allPlaylistIds = playlists.map(p => p.playlistId);
		const allVideoIds = playlists.flatMap(p => p.videos.map(v => v.videoId));

		// データベースに既に存在するプレイリストIDとビデオIDを取得
		const existingPlaylists = await prisma.playlist.findMany({
			where: { playlistId: { in: allPlaylistIds } },
			select: { playlistId: true },
		});
		const existingPlaylistIds = new Set(existingPlaylists.map(p => p.playlistId));

		const existingVideos = await prisma.video.findMany({
			where: { videoId: { in: allVideoIds } },
			select: { videoId: true },
		});
		const existingVideoIds = new Set(existingVideos.map(v => v.videoId));

		// 新規プレイリストデータと新規ビデオデータを準備
		const newPlaylistsToCreate = playlists
			.filter(p => !existingPlaylistIds.has(p.playlistId))
			.map(p => ({
				playlistId: p.playlistId,
				title: p.title,
				link: p.link,
				liveDate: p.liveDate,
				// tags: p.tags, // createManyではリレーションや配列のデフォルト以外の初期化が複雑な場合があるため、別途検討
			}));

		const newVideosToCreate = playlists.flatMap(p =>
			p.videos
				.filter(v => !existingVideoIds.has(v.videoId))
				.map(v => ({
					videoId: v.videoId,
					title: v.title,
					link: v.link,
					liveDate: v.liveDate,
					playlistId: p.playlistId,
					// tags: v.tags,
				}))
		);

		// トランザクション内で新規データのみを一括作成
		// createMany はリレーションシップのネストした作成をサポートしていないため、
		// Playlist と Video を別々に作成する必要がある。
		// また、tagsのような配列フィールドのデフォルト値以外の設定も createMany では直接できない場合がある。
		// そのため、ここでは基本的なフィールドのみをcreateManyで作成し、
		// tagsなどは別途更新するか、個別のcreateにフォールバックするなどの対応が必要になる可能性がある。
		// 今回はまず、主要なフィールドのcreateManyを試みる。

		if (newPlaylistsToCreate.length > 0) {
			await prisma.playlist.createMany({
				data: newPlaylistsToCreate,
				skipDuplicates: true, // 念のため重複をスキップ
			});
		}

		if (newVideosToCreate.length > 0) {
			// 関連するプレイリストが先に存在している必要があるため、プレイリスト作成後にビデオを作成
			// もしプレイリストが新規作成された場合、そのIDは newPlaylistsToCreate に含まれる。
			// newVideosToCreate の playlistId がDBに存在することを確認する必要があるが、
			// YouTubeから取得するデータ構造上、videoは必ずplaylistに紐づくため、
			// playlistを先に処理すれば問題ないはず。
			await prisma.video.createMany({
				data: newVideosToCreate,
				skipDuplicates: true, // 念のため重複をスキップ
			});
		}

		// 注意: この方法では既存データの更新は行われません。
		// タイトル変更などの更新も行う場合は、別途update処理を追加するか、
		// やはりupsertを使い、update部分を軽量化するアプローチを検討する必要があります。
		// 今回はユーザーの「新規のデータのみをinsert」という要望を優先します。

	} catch (error) {
		console.error("Error in createPlaylistBatch:", error);
		throw error; // エラーを呼び出し元にスローして処理させる
	}
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
		const {
			liveOrBand,
			bandName,
			liveName,
			tag,
			tagSearchMode = 'or',
			sort,
			page,
			videoPerPage,
		} = query

		const pageNumber = Number(page) || 1
		const videoPerPageNumber = Number(videoPerPage) || 10

		let results: YoutubeDetail[] = []
		let totalCount = 0

		if (liveOrBand === 'live') {
			const [playlists, count] = await Promise.all([
				prisma.playlist.findMany({
					where: {
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
							tag && tag.length > 0
								? tagSearchMode === 'and'
									? { tags: { hasEvery: tag } }
									: { tags: { hasSome: tag } }
								: {},
						],
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
							tag && tag.length > 0
								? tagSearchMode === 'and'
									? { tags: { hasEvery: tag } }
									: { tags: { hasSome: tag } }
								: {},
						],
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
							tag && tag.length > 0
								? tagSearchMode === 'and'
									? { tags: { hasEvery: tag } }
									: { tags: { hasSome: tag } }
								: {},
						],
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
							tag && tag.length > 0
								? tagSearchMode === 'and'
									? { tags: { hasEvery: tag } }
									: { tags: { hasSome: tag } }
								: {},
						],
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
