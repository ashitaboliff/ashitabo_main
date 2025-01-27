'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { YouTubeEmbed } from '@next/third-parties/google'
import 'lite-youtube-embed/src/lite-yt-embed.css'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { YoutubeDetail, liveOrBand } from '@/types/YoutubeTypes'
import Tags from '@/components/atoms/Tags'

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
					<>
						<lite-youtube
							videoid={youtubeDetail.videoId ?? ''}
							playlistid={youtubeDetail.id}
							style={{ width: '368px', height: '207px' }}
						></lite-youtube>
					</>
				) : (
					<YouTubeEmbed videoid={youtubeDetail.id} width={368} />
				)}
			</div>
			<div className="flex flex-col gap-y-1 justify-center w-92">
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
		</div>
	)
}

export default YoutubeDetailBox
