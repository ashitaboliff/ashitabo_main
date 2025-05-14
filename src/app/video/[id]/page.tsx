'use server'

import { notFound } from 'next/navigation'
import VideoDetailPage from '@/features/video/components/VideoDetailPage' // 修正
import {
	getPlaylistByIdAction,
	getVideoByIdAction,
} from '@/features/video/components/actions'
import { getSession } from '@/app/actions'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const session = await getSession()
	const id = (await params).id
	const liveOrBand = id.startsWith('PL') && id.length > 12 ? 'live' : 'band'
	if (liveOrBand === 'live') {
		const playlist = await getPlaylistByIdAction(id)
		if (playlist.status !== 200) {
			return notFound()
		}
		return (
			<VideoDetailPage
				detail={playlist.response}
				liveOrBand={liveOrBand}
				session={session}
			/>
		)
	} else if (liveOrBand === 'band') {
		const video = await getVideoByIdAction(id)
		if (video.status !== 200) {
			return notFound()
		}
		const playlist = await getPlaylistByIdAction(video.response.playlistId)
		if (playlist.status !== 200) {
			return notFound()
		}
		return (
			<VideoDetailPage
				detail={video.response}
				liveOrBand={liveOrBand}
				session={session}
				playlist={playlist.response}
			/>
		)
	}
}

export default Page
