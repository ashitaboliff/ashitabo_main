'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import LocalFont from 'next/font/local'
import { YouTubeEmbed } from '@next/third-parties/google'
import 'lite-youtube-embed/src/lite-yt-embed.css'
import { liveOrBand, Playlist, Video } from '@/types/YoutubeTypes'
import { ErrorType } from '@/types/ResponseTypes'
import { Session } from 'next-auth'
import Tags from '@/components/atoms/Tags'
import TagInputField from '@/components/molecules/TagsInputField'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import { updateTagsAction } from './actions'

import { TbEdit } from 'react-icons/tb'
import { HiOutlineExternalLink } from 'react-icons/hi'

const gkktt = LocalFont({
	src: '../../lib/fonts/851Gkktt_005.woff',
	weight: 'normal',
	style: 'normal',
	variable: '--851-gkktt',
})

type Props = {
	session: Session | null
	liveOrBand: liveOrBand
} & (
	| { liveOrBand: 'live'; playlist?: Playlist; detail: Playlist }
	| { liveOrBand: 'band'; playlist: Playlist; detail: Video }
)

const YoutubeIdPage = ({ session, detail, liveOrBand, playlist }: Props) => {
	const router = useRouter()
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const [isSessionOpen, setIsSessionOpen] = useState<boolean>(false)
	const [error, setError] = useState<ErrorType>()
	const popupRef = useRef<PopupRef>()
	const sessionPopupRef = useRef<PopupRef>()

	const { handleSubmit, control, setValue } = useForm()

	const onSubmit = async (data: any) => {
		const id = liveOrBand === 'band' ? detail.videoId : detail.playlistId

		const res = await updateTagsAction(id, data.tags, liveOrBand)
		if (res.status === 200) {
			setIsPopupOpen(false)
		} else {
			setError(res)
		}
	}

	const handlePopupOpen = () => {
		if (!session) {
			setIsSessionOpen(true)
		} else {
			setIsPopupOpen(true)
		}
	}

	return (
		<>
			{liveOrBand === 'band' && (
				<div className="flex flex-col items-center">
					<div
						className={`text-4xl font-bold text-center mt-6 mb-4 ${gkktt.className}`}
					>
						動画詳細
					</div>
					<div className="flex flex-col my-2 justify-center">
						<YouTubeEmbed videoid={detail.videoId} width={368} />
					</div>
					<div className="flex flex-col justify-center w-92">
						<div className="text-xl font-bold">
							{detail.title.split('(')[0]}
						</div>
						<div className="flex flex-row justify-start gap-x-2">
							<div className="text-xs">{playlist.title.split('(')[0]}</div>
							<div className="text-xs">
								{format(detail.liveDate, 'yyyy年MM月dd日', { locale: ja })}
							</div>
						</div>
						<div className="flex flex-row justify-between w-92 mt-2">
							<div className="flex flex-row">
								{detail.tags && (
									<Tags
										tags={detail.tags}
										size="text-sm"
										isLink
										liveOrBand={liveOrBand}
									/>
								)}
							</div>
							<button
								className="btn btn-outline btn-primary btn-sm"
								onClick={() => {
									handlePopupOpen()
								}}
							>
								<TbEdit size={15} />
							</button>
						</div>
						<button
							className="btn btn-secondary-light w-44 mt-4"
							onClick={() => {
								window.open(
									`https://www.youtube.com/watch?v=${detail.videoId}`,
									'_blank',
								)
							}}
						>
							YouTubeで見る <HiOutlineExternalLink size={25} />
						</button>
					</div>
					<div
						className="flex flex-col items-center gap-y-2 mt-4"
						onClick={() => {
							window.open(
								`https://www.youtube.com/playlist?list=${playlist.playlistId}`,
								'_blank',
							)
						}}
					>
						<div className="text-lg font-bold flex flex-row items-center">
							この動画のあるプレイリストはこちら{' '}
							<HiOutlineExternalLink size={15} />
						</div>
						<div className="flex flex-row w-92 justify-between">
							<lite-youtube
								videoid={detail.videoId ?? ''}
								playlistid={playlist.playlistId}
								style={{ width: '144px', height: '81px' }}
							></lite-youtube>
							<div className="flex flex-col justify-center w-52">
								<div className="text-sm font-bold">
									{playlist.title.split('(')[0]}
								</div>
								<div className="text-xs">
									{format(playlist.liveDate, 'yyyy年MM月dd日', { locale: ja })}
								</div>
							</div>
						</div>
					</div>
					<button
						className="btn btn-outline mt-4 w-92"
						onClick={() => router.back()}
					>
						戻る
					</button>
				</div>
			)}
			{liveOrBand === 'live' && (
				<div className="flex flex-col items-center">
					<div
						className={`text-4xl font-bold text-center mt-6 mb-4 ${gkktt.className}`}
					>
						動画詳細
					</div>
					<div className="flex flex-col my-2 justify-center">
						<lite-youtube
							videoid={detail.videos[0].videoId ?? ''}
							playlistid={detail.playlistId}
							style={{ width: '368px', height: '207px' }}
						></lite-youtube>
					</div>
					<div className="flex flex-col justify-center w-92">
						<div className="text-xl font-bold">
							{detail.title.split('(')[0]}
						</div>
						<div className="flex flex-row justify-start gap-x-2">
							<div className="text-xs">
								{format(detail.liveDate, 'yyyy年MM月dd日', { locale: ja })}
							</div>
						</div>
						<div className="flex flex-row justify-between w-92 mt-2">
							<div className="flex flex-row">
								{detail.tags && (
									<Tags
										tags={detail.tags}
										size="text-sm"
										isLink
										liveOrBand={liveOrBand}
									/>
								)}
							</div>
							<button
								className="btn btn-outline btn-primary btn-sm"
								onClick={() => {
									handlePopupOpen()
								}}
							>
								<TbEdit size={15} />
							</button>
						</div>
						<button
							className="btn btn-secondary-light w-44 mt-4"
							onClick={() => {
								window.open(
									`https://www.youtube.com/playlist?list=${detail.playlistId}`,
									'_blank',
								)
							}}
						>
							YouTubeで見る <HiOutlineExternalLink size={25} />
						</button>
					</div>
					<button
						className="btn btn-outline mt-4 w-92"
						onClick={() => router.back()}
					>
						戻る
					</button>
				</div>
			)}
			<Popup
				ref={popupRef}
				title="タグ編集"
				open={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
			>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-y-2 justify-center max-w-sm m-auto"
				>
					<TagInputField
						control={control}
						name="tags"
						placeholder="タグ"
						defaultValue={detail.tags}
						setValue={setValue}
					/>
					<div className="flex flex-row justify-center gap-x-2">
						<button type="submit" className="btn btn-primary">
							更新
						</button>
						<button
							type="button"
							className="btn btn-outline"
							onClick={() => {
								setIsPopupOpen(false)
							}}
						>
							キャンセル
						</button>
					</div>
					{error && (
						<div className="text-error text-sm text-center">
							{error.response}
						</div>
					)}
				</form>
			</Popup>
			<Popup
				ref={sessionPopupRef}
				title="利用登録が必要です"
				open={isSessionOpen}
				onClose={() => setIsSessionOpen(false)}
			>
				<div className="flex flex-col gap-y-2 justify-center max-w-sm m-auto">
					<div className="text-sm text-center">
						タグ編集を行うには利用登録が必要です
					</div>
					<div className="flex flex-row justify-center gap-x-2">
						<button
							className="btn btn-primary"
							onClick={() => {
								router.push('/auth/signin')
							}}
						>
							ログイン
						</button>
						<button
							className="btn btn-outline"
							onClick={() => {
								setIsSessionOpen(false)
							}}
						>
							閉じる
						</button>
					</div>
				</div>
			</Popup>
		</>
	)
}

export default YoutubeIdPage
