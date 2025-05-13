'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { YouTubeEmbed } from '@next/third-parties/google'
import 'lite-youtube-embed/src/lite-yt-embed.css'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { YoutubeDetail, liveOrBand } from '@/types/YoutubeTypes'
import Tags from '@/components/ui/atoms/Tags'

const YoutubeDetailBox = ({
	youtubeDetail,
	liveOrBand,
}: {
	youtubeDetail: YoutubeDetail
	liveOrBand: liveOrBand
}) => {
	const router = useRouter()

	return (
		<div className="flex flex-col items-center">
			<div className="flex flex-col gap-y-1 justify-center">
				{liveOrBand === 'live' ? (
					<YouTubeEmbed videoid={youtubeDetail.videoId ?? ''} width={368} />
				) : (
					<YouTubeEmbed videoid={youtubeDetail.id} width={368} />
				)}
			</div>
			<div className="flex flex-row gap-x-2 w-[23rem] justify-between">
				<div
					className="flex flex-col gap-y-1 justify-center w-[23rem] link link-hover"
					onClick={() => router.push(`/video/${youtubeDetail.id}`)}
				>
					<div className="text-base font-bold">
						{youtubeDetail.title.split('(')[0]}
					</div>
					{liveOrBand === 'band' && (
						<div className="text-sm">
							ライブ名: {youtubeDetail.playlistTitle?.split('(')[0]}
						</div>
					)}
					<div className="text-sm">
						{format(youtubeDetail.liveDate, 'yyyy年MM月dd日', { locale: ja })}
					</div>
					<Tags tags={youtubeDetail.tags} />
				</div>
				<div className="flex flex-col gap-y-1 justify-center">
					<button
						className="btn btn-outline text-sm whitespace-nowrap"
						onClick={() => router.push(`/video/${youtubeDetail.id}`)}
					>
						詳細
					</button>
				</div>
			</div>
		</div>
	)
}

export default YoutubeDetailBox
