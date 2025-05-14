'use client'

import { useRouter } from 'next-nprogress-bar'
import { YouTubeEmbed } from '@next/third-parties/google'
import 'lite-youtube-embed/src/lite-yt-embed.css'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { YoutubeDetail, liveOrBand } from '@/features/video/types'
import Tags from '@/components/ui/atoms/Tags'

const VideoItem = ({
	// YoutubeDetailBox -> VideoItem
	youtubeDetail,
	liveOrBand,
}: {
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
		<div className="flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow w-full gap-3 sm:gap-4">
			{videoId && (
				<div
					className="cursor-pointer w-full sm:w-1/3 lg:w-1/4 flex-shrink-0"
					onClick={() => router.push(`/video/${youtubeDetail.id}`)}
				>
					<div className="aspect-video rounded overflow-hidden">
						{/* YouTubeEmbedのwidthは親要素に追従させるか、固定値をレスポンシブに設定 */}
						<YouTubeEmbed
							videoid={videoId}
							params="controls=0&showinfo=0&rel=0"
						/>
					</div>
				</div>
			)}
			<div className="flex flex-col gap-y-1 w-full">
				<div
					className="text-base md:text-lg font-bold link link-hover"
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
						<Tags tags={youtubeDetail.tags} size="text-xs" />
					</div>
				)}
				<button
					className="btn btn-outline btn-sm text-xs sm:text-sm whitespace-nowrap mt-2 self-start"
					onClick={() => router.push(`/video/${youtubeDetail.id}`)}
				>
					詳細を見る
				</button>
			</div>
		</div>
	)
}

export default VideoItem // YoutubeDetailBox -> VideoItem
