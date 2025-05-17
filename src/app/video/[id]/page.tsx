'use server'

import { notFound } from 'next/navigation'
import VideoDetailPage from '@/features/video/components/VideoDetailPage' // 修正
import {
	getPlaylistByIdAction,
	getVideoByIdAction,
} from '@/features/video/components/actions'
import { getSession } from '@/app/actions'
import { createMetaData } from '@/utils/metaData'
import { Metadata, ResolvingMetadata } from 'next'

type Props = {
	params: Promise<{ id: string }>
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	// You might want to fetch data here to include in the title or description
	const id = (await params).id
	const liveOrBand = id.startsWith('PL') && id.length > 12 ? 'live' : 'band'
	let title = liveOrBand === 'live' ? 'ライブ動画詳細' : 'バンド動画詳細'
	let description = `あしたぼの${liveOrBand}動画 (${id}) の詳細ページです。`

	if (liveOrBand === 'live') {
		const playlistResult = await getPlaylistByIdAction(id)
		if (playlistResult.status === 200 && playlistResult.response) {
			const playlistData = playlistResult.response
			title = playlistData.title
				? `${playlistData.title} | ライブ動画`
				: `ライブ動画 ${id}`
			// Playlist type does not have a description property, using title for description
			description = `あしたぼのライブ動画 (${playlistData.title || id}) の詳細ページです。`
		}
	} else {
		const videoResult = await getVideoByIdAction(id)
		if (videoResult.status === 200 && videoResult.response) {
			const videoData = videoResult.response
			title = videoData.title
				? `${videoData.title} | バンド動画`
				: `バンド動画 ${id}`
			// Video type does not have a direct description property, using title for description
			description = `あしたぼのバンド動画 (${videoData.title || id}) の詳細ページです。`
		}
	}

	return createMetaData({
		title,
		description,
		pathname: `/video/${id}`,
	})
}

const Page = async ({ params }: Props) => {
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
