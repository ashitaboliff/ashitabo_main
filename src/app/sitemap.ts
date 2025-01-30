import { MetadataRoute } from 'next'
import { getBookingIdAction, getYoutubeIdAction } from '@/app/actions'

const URL = process.env.AUTH_URL

const getBookingsMap = async (): Promise<MetadataRoute.Sitemap> => {
	const bookingIds = await getBookingIdAction()
	return bookingIds.map((id) => ({
		url: `${URL}/booking/${id}`,
		priority: 0.5,
	}))
}

const getYoutubeMap = async (): Promise<MetadataRoute.Sitemap> => {
	const youtubeIds = await getYoutubeIdAction()
	return youtubeIds.map((id) => ({
		url: `${URL}/video/${id}`,
		priority: 0.5,
	}))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const bookingsMap = await getBookingsMap()
	const youtubeMap = await getYoutubeMap()

	return [
		{
			url: `${URL}/home`,
			lastModified: new Date(),
			priority: 1,
		},
		{
			url: `${URL}/booking`,
			lastModified: new Date(),
			priority: 0.8,
		},
		{
			url: `${URL}/video`,
			lastModified: new Date(),
			priority: 0.8,
		},
		{
			url: `${URL}/blogs`,
			lastModified: new Date(),
			priority: 0.8,
		},
		...bookingsMap,
		...youtubeMap,
	]
}
