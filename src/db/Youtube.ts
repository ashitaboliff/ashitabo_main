'use server'

import prisma from '@/lib/prisma/prisma'
import { unstable_cache } from 'next/cache'
import { Playlist } from '@/types/YoutubeTypes'

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
				},
				create: {
					playlistId: item.playlistId,
					title: item.title,
					link: item.link,
				},
			})

			for (const video of item.videos) {
				await prisma.video.upsert({
					where: { videoId: video.videoId },
					update: {
						title: video.title,
						link: video.link,
						playlistId: playlist.playlistId,
					},
					create: {
						videoId: video.videoId,
						title: video.title,
						link: video.link,
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
