'use client'

import { useRouter } from 'next-nprogress-bar'
import { Session } from 'next-auth'
import { YouTubeEmbed } from '@next/third-parties/google'
import 'lite-youtube-embed/src/lite-yt-embed.css'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { YoutubeDetail, liveOrBand } from '@/features/video/types'
import Tags from '@/components/ui/atoms/Tags'
import TagEditPopup from '@/features/video/components/TagEditPopup'

const VideoItem = ({
	session,
	youtubeDetail,
	liveOrBand,
}: {
	session: Session | null
	youtubeDetail: YoutubeDetail
	liveOrBand: liveOrBand
}) => {
	const router = useRouter()
	const videoId =
		liveOrBand === 'live' ? youtubeDetail.videoId : youtubeDetail.id
	const displayTitle = youtubeDetail.title.split('(')[0]
	const playlistTitle =
		liveOrBand === 'band'
			? youtubeDetail.playlistTitle?.split('(')[0]
			: undefined

	return (
		<div className="flex flex-col xl:flex-row items-start p-3 sm:p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow w-full gap-4">
			{videoId && (
				<div
					className="cursor-pointer w-full xl:w-1/3 flex-shrink-0"
					onClick={() => router.push(`/video/${youtubeDetail.id}`)}
				>
					<div className="aspect-video rounded overflow-hidden">
						<YouTubeEmbed videoid={videoId} />
					</div>
				</div>
			)}
			<div className="flex flex-col gap-y-2 w-full">
				<div
					className="text-lg xl:text-xl font-bold link link-hover"
					onClick={() => router.push(`/video/${youtubeDetail.id}`)}
				>
					{displayTitle}
				</div>
				{playlistTitle && (
					<div className="text-sm">ライブ名: {playlistTitle}</div>
				)}
				<div className="text-sm">
					{format(youtubeDetail.liveDate, 'yyyy年MM月dd日', { locale: ja })}
				</div>
				{youtubeDetail.tags && youtubeDetail.tags.length > 0 && (
					<div className="mt-1 flex flex-wrap gap-1">
						<Tags tags={youtubeDetail.tags} size="text-xs-custom" />
					</div>
				)}
				<div className="flex flex-wrap gap-2 mt-2">
					<button
						className="btn btn-outline btn-sm text-xs-custom xl:text-sm whitespace-nowrap"
						onClick={() => router.push(`/video/${youtubeDetail.id}`)}
					>
						詳細を見る
					</button>
					<TagEditPopup
						session={session}
						id={youtubeDetail.id}
						currentTags={youtubeDetail.tags}
						liveOrBand={liveOrBand}
						isFullButton={true}
					/>
				</div>
			</div>
		</div>
	)
}

export default VideoItem
