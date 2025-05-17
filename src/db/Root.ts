'use server'

import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

export const getAllBookingId = async () => {
	async function getAllBookingId() {
		try {
			const bookingId = await prisma.booking.findMany({
				where: {
					is_deleted: false,
				},
				select: {
					id: true,
				},
			})
			const allBookingId = bookingId.map((booking) => booking.id)
			return allBookingId
		} catch (error) {
			throw error
		}
	}
	const bookingId = unstable_cache(getAllBookingId, [], {
		tags: ['booking'],
	})
	const result = await bookingId()
	return result
}

export const getAllYoutubeId = async () => {
	async function getAllYoutubeId() {
		try {
			const youtubeId = await prisma.playlist.findMany({
				select: {
					playlistId: true,
					videos: {
						select: {
							videoId: true,
						},
					},
				},
			})

			const allYoutubeId: string[] = youtubeId.flatMap((playlist) =>
				playlist.videos.map((video) => video.videoId),
			)
			return allYoutubeId
		} catch (error) {
			throw error
		}
	}

	const youtubeId = unstable_cache(getAllYoutubeId, [], {
		tags: ['youtube'],
	})
	const result = await youtubeId()
	return result
}
