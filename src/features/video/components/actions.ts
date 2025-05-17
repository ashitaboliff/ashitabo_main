'use server'

import { google, youtube_v3 } from 'googleapis'
import { GaxiosResponse } from 'gaxios'
import { ApiResponse, StatusCode } from '@/utils/types/responseTypes'
import {
	Playlist,
	Token,
	Video,
	YoutubeDetail,
	YoutubeSearchQuery,
	liveOrBand,
} from '@/features/video/types'
import {
	createPlaylistBatch,
	getAccessToken,
	upsertAccessToken,
	searchYoutubeDetails,
	getPlaylistById,
	getVideoById,
	getPlaylist,
	updateTags,
} from '@/features/video/lib/repository'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import * as yup from 'yup'

// バリデーションスキーマ
const youtubeSearchQuerySchema = yup.object().shape({
	liveOrBand: yup.string().oneOf(['live', 'band']).required(),
	bandName: yup
		.string()
		.optional()
		.max(100, 'バンド名は100文字以内で入力してください。'),
	liveName: yup
		.string()
		.optional()
		.max(100, 'ライブ名は100文字以内で入力してください。'),
	tag: yup
		.array()
		.of(yup.string().max(50, '各タグは50文字以内で入力してください。'))
		.optional(),
	tagSearchMode: yup.string().oneOf(['and', 'or']).optional(), // tagSearchModeのバリデーション追加
	sort: yup.string().oneOf(['new', 'old']).required(),
	page: yup.number().integer().min(1).required(),
	videoPerPage: yup.number().integer().min(1).max(50).required(), // Max 50件など制限を設ける
})

const updateTagsSchema = yup.object().shape({
	id: yup.string().required('IDは必須です。'),
	tags: yup
		.array()
		.of(yup.string().max(50, '各タグは50文字以内で入力してください。'))
		.required(),
	liveOrBand: yup.string().oneOf(['live', 'band']).required('種別は必須です。'),
})

export async function getAuthUrl(): Promise<ApiResponse<string>> {
	const oauth2Client = new google.auth.OAuth2(
		process.env.YOUTUBE_CLIENT_ID!,
		process.env.YOUTUBE_CLIENT_SECRET!,
		process.env.YOUTUBE_REDIRECT_URI!,
	)

	const authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: [
			'https://www.googleapis.com/auth/youtube.readonly',
			'https://www.googleapis.com/auth/userinfo.profile',
		],
	})

	return { status: StatusCode.OK, response: authUrl }
}

export async function getAccessTokenAction(): Promise<ApiResponse<Token>> {
	const oauth2Client = new google.auth.OAuth2(
		process.env.YOUTUBE_CLIENT_ID!,
		process.env.YOUTUBE_CLIENT_SECRET!,
		process.env.YOUTUBE_REDIRECT_URI!,
	)

	const cookieStore = await cookies()
	const tokenExpired = cookieStore.get('tokenExpired')?.value

	const accessToken = await getAccessToken()

	if (accessToken) {
		if (!tokenExpired || new Date(tokenExpired) < new Date()) {
			oauth2Client.setCredentials({ refresh_token: accessToken.refresh_token })

			try {
				const { credentials } = await oauth2Client.refreshAccessToken()
				if (!credentials.access_token) {
					return {
						status: StatusCode.INTERNAL_SERVER_ERROR,
						response:
							'アクセストークンの更新に失敗しました。(トークン取得不可)',
					}
				}
				await upsertAccessToken({
					tokens: {
						id: accessToken?.google_id || '',
						access_token: credentials.access_token || '',
						refresh_token: credentials.refresh_token || '',
						expiry_date: credentials.expiry_date?.toString() || '',
					},
				})
				revalidateTag('youtube-token')
				const token: Token = {
					google_id: accessToken?.google_id || '',
					created_at: accessToken?.created_at || new Date(),
					updated_at: new Date(),
					email: accessToken?.email || '',
					access_token: credentials.access_token || '',
					refresh_token: credentials.refresh_token || '',
					token_expiry: new Date(credentials.expiry_date || 0) || new Date(),
					is_deleted: accessToken?.is_deleted || false,
				}
				return { status: StatusCode.OK, response: token }
			} catch (error: any) {
				console.error('Error refreshing access token:', error)
				let errorMessage =
					'アクセストークンの更新に失敗しました。再度YouTube認証を行ってください。'
				if (error.response?.data?.error_description) {
					errorMessage += ` (${error.response.data.error_description})`
				}
				return {
					status: StatusCode.INTERNAL_SERVER_ERROR,
					response: errorMessage,
				}
			}
		} else {
			return { status: StatusCode.OK, response: accessToken }
		}
	} else {
		return {
			status: StatusCode.UNAUTHORIZED,
			response: 'アクセストークンが見つかりませんでした',
		}
	}
}

export async function createPlaylistAction(): Promise<ApiResponse<string>> {
	try {
		const oauth2Client = new google.auth.OAuth2(
			process.env.YOUTUBE_CLIENT_ID!,
			process.env.YOUTUBE_CLIENT_SECRET!,
			process.env.YOUTUBE_REDIRECT_URI!,
		)

		const accessToken = await getAccessTokenAction()
		if (accessToken.status !== StatusCode.OK) {
			return {
				status: StatusCode.UNAUTHORIZED,
				response: accessToken.response as string,
			}
		}

		oauth2Client.setCredentials({
			access_token: accessToken.response.access_token,
		})
		const youtube = google.youtube({ version: 'v3', auth: oauth2Client })

		const allPlaylists: youtube_v3.Schema$Playlist[] = []
		let nextPageToken: string | undefined = undefined

		do {
			const playlistsResponse: GaxiosResponse<youtube_v3.Schema$PlaylistListResponse> =
				await youtube.playlists.list({
					part: ['snippet'],
					mine: true,
					maxResults: 50,
					pageToken: nextPageToken,
				})

			nextPageToken = playlistsResponse.data.nextPageToken || undefined
			if (playlistsResponse.data.items) {
				allPlaylists.push(...playlistsResponse.data.items)
			}
		} while (nextPageToken)

		const results: Playlist[] = []

		for (const playlist of allPlaylists) {
			const playlistId = playlist.id!
			const playlistTitle = playlist.snippet?.title || 'No Title'
			const playlistLink = `https://www.youtube.com/playlist?list=${playlistId}`

			const dateMatch = playlistTitle.match(/\d{4}\/\d{1,2}\/\d{1,2}/)
			let liveDate = ''
			if (dateMatch) {
				const [year, month, day] = dateMatch[0].split('/').map(Number)
				liveDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
			}

			const allVideos: youtube_v3.Schema$PlaylistItem[] = []
			let nextVidPageToken: string | undefined = undefined

			do {
				const videosResponse: GaxiosResponse<youtube_v3.Schema$PlaylistItemListResponse> =
					await youtube.playlistItems.list({
						part: ['snippet'],
						playlistId,
						maxResults: 50,
						pageToken: nextVidPageToken,
					})

				nextVidPageToken = videosResponse.data.nextPageToken || undefined
				if (videosResponse.data.items) {
					allVideos.push(...videosResponse.data.items)
				}
			} while (nextVidPageToken)

			const videos = allVideos.map((video) => ({
				title: video.snippet?.title || 'No Title',
				link: `https://www.youtube.com/watch?v=${video.snippet?.resourceId?.videoId}`,
				videoId: video.snippet?.resourceId?.videoId || '',
				playlistId,
				liveDate: liveDate,
			}))

			results.push({
				playlistId,
				title: playlistTitle,
				link: playlistLink,
				liveDate,
				videos,
			})
		}

		await createPlaylistBatch(results)
		revalidateTag('youtube')
		return {
			status: StatusCode.OK,
			response: 'プレイリストと動画情報を更新しました。',
		}
	} catch (error: any) {
		console.error('Error creating playlist action:', error)
		let errorMessage = 'プレイリスト情報の取得または保存に失敗しました。'
		if (error.response?.data?.error?.message) {
			errorMessage += ` (APIエラー: ${error.response.data.error.message})`
		} else if (error.message) {
			errorMessage += ` (${error.message})`
		}
		return { status: StatusCode.INTERNAL_SERVER_ERROR, response: errorMessage }
	}
}

export async function searchYoutubeDetailsAction(
	query: YoutubeSearchQuery,
): Promise<ApiResponse<{ results: YoutubeDetail[]; totalCount: number }>> {
	try {
		await youtubeSearchQuerySchema.validate(query)
		const results = await searchYoutubeDetails(query)
		return { status: StatusCode.OK, response: results }
	} catch (error: any) {
		if (error instanceof yup.ValidationError) {
			return {
				status: StatusCode.BAD_REQUEST,
				response: error.errors.join(', '),
			}
		}
		console.error('Error searching YouTube details:', error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: '検索処理中にエラーが発生しました。',
		}
	}
}

export async function getPlaylistByIdAction(
	id: string,
): Promise<ApiResponse<Playlist>> {
	try {
		const playlist = await getPlaylistById(id)
		if (!playlist) {
			return {
				status: StatusCode.NOT_FOUND,
				response: '指定されたプレイリストは見つかりませんでした。',
			}
		}
		return { status: StatusCode.OK, response: playlist }
	} catch (error: any) {
		console.error(`Error fetching playlist by ID (${id}):`, error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'プレイリスト情報の取得に失敗しました。',
		}
	}
}

export async function getVideoByIdAction(
	id: string,
): Promise<ApiResponse<Video>> {
	try {
		const video = await getVideoById(id)
		if (!video) {
			return {
				status: StatusCode.NOT_FOUND,
				response: '指定された動画は見つかりませんでした。',
			}
		}
		return { status: StatusCode.OK, response: video }
	} catch (error: any) {
		console.error(`Error fetching video by ID (${id}):`, error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: '動画情報の取得に失敗しました。',
		}
	}
}

export async function getPlaylistAction(): Promise<ApiResponse<Playlist[]>> {
	try {
		const playlists = await getPlaylist()
		return { status: StatusCode.OK, response: playlists }
	} catch (error: any) {
		console.error('Error fetching all playlists:', error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'プレイリスト一覧の取得に失敗しました。',
		}
	}
}

export async function updateTagsAction(
	id: string,
	tags: string[],
	liveOrBand: liveOrBand,
): Promise<ApiResponse<string>> {
	try {
		await updateTagsSchema.validate({ id, tags, liveOrBand })
		const sanitizedTags = tags
			.filter((tag) => tag.trim() !== '')
			.map((tag) => tag.trim()) // 空タグ除去とトリム
		await updateTags({ id, tags: sanitizedTags, liveOrBand })
		if (liveOrBand === 'live') {
			revalidateTag(`playlist-${id}`)
		}
		if (liveOrBand === 'band') {
			revalidateTag(`video-${id}`)
		}
		revalidateTag('youtube') // 関連するリスト表示も更新されるように
		return { status: StatusCode.OK, response: 'タグを更新しました。' }
	} catch (error: any) {
		if (error instanceof yup.ValidationError) {
			return {
				status: StatusCode.BAD_REQUEST,
				response: error.errors.join(', '),
			}
		}
		console.error(`Error updating tags for ${liveOrBand} ID (${id}):`, error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'タグの更新に失敗しました。',
		}
	}
}

export async function revalidateYoutubeTag() {
	revalidateTag('youtube')
}
