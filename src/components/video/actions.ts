'use server'

import { google, youtube_v3 } from 'googleapis'
import { GaxiosResponse } from 'gaxios'
import { ApiResponse, StatusCode } from '@/types/ResponseTypes'
import {
	Playlist,
	Token,
	Video,
	YoutubeDetail,
	YoutubeSearchQuery,
	liveOrBand,
} from '@/types/YoutubeTypes'
import {
	createPlaylist,
	getAccessToken,
	upsertAccessToken,
	searchYoutubeDetails,
	getPlaylistById,
	getVideoById,
	getPlaylist,
	updateTags,
} from '@/db/Youtube'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

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
			} catch (error) {
				return {
					status: StatusCode.INTERNAL_SERVER_ERROR,
					response:
						'アクセストークンの更新に失敗しました。再度YouTube認証を行ってください。',
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

		await createPlaylist(results)
		revalidateTag('youtube')
		return { status: StatusCode.OK, response: 'Playlist created successfully' }
	} catch (error) {
		return { status: StatusCode.INTERNAL_SERVER_ERROR, response: String(error) }
	}
}

export async function searchYoutubeDetailsAction(
	query: YoutubeSearchQuery,
): Promise<ApiResponse<{ results: YoutubeDetail[]; totalCount: number }>> {
	try {
		const results = await searchYoutubeDetails(query)
		return { status: StatusCode.OK, response: results }
	} catch (error) {
		return { status: StatusCode.INTERNAL_SERVER_ERROR, response: String(error) }
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
				response: 'プレイリストが見つけられませんでした',
			}
		}
		return { status: StatusCode.OK, response: playlist }
	} catch (error) {
		return { status: StatusCode.INTERNAL_SERVER_ERROR, response: String(error) }
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
				response: '動画が見つけられませんでした',
			}
		}
		return { status: StatusCode.OK, response: video }
	} catch (error) {
		return { status: StatusCode.INTERNAL_SERVER_ERROR, response: String(error) }
	}
}

export async function getPlaylistAction(): Promise<ApiResponse<Playlist[]>> {
	try {
		const playlists = await getPlaylist()
		return { status: StatusCode.OK, response: playlists }
	} catch (error) {
		return { status: StatusCode.INTERNAL_SERVER_ERROR, response: String(error) }
	}
}

export async function updateTagsAction(
	id: string,
	tags: string[],
	liveOrBand: liveOrBand,
): Promise<ApiResponse<string>> {
	try {
		if (tags.length === 1 && tags[0] === '') {
			tags = []
		}
		await updateTags({ id, tags, liveOrBand })
		if (liveOrBand === 'live') {
			revalidateTag(`playlist-${id}`)
		}
		if (liveOrBand === 'band') {
			revalidateTag(`video-${id}`)
		}
		return { status: StatusCode.OK, response: 'Tags updated successfully' }
	} catch (error) {
		return { status: StatusCode.INTERNAL_SERVER_ERROR, response: String(error) }
	}
}

export async function revalidateYoutubeTag() {
	revalidateTag('youtube')
}
