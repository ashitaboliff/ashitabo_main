'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import {
	getAuthUrl,
	createPlaylistAction,
	revalidateYoutubeTag,
} from '@/components/video/actions'
import { Playlist } from '@/types/YoutubeTypes'
import { ErrorType } from '@/types/ResponseTypes'
import SelectField from '@/components/atoms/SelectField'
import Tags from '@/components/atoms/Tags'
import Popup, { PopupRef } from '@/components/molecules/Popup'

const YoutubeManagement = ({
	playlists,
	isAccessToken,
}: {
	playlists: Playlist[] | undefined | null
	isAccessToken: boolean
}) => {
	const router = useRouter()
	const [error, setError] = useState<ErrorType>()
	const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState<boolean>(false)
	const successPopupRef = useRef<PopupRef>(undefined)

	const [isLoading, setIsLoading] = useState<boolean>(false)

	const [currentPage, setCurrentPage] = useState<number>(1)
	const [playlistPerPage, setPlaylistPerPage] = useState(10)
	const [popupData, setPopupData] = useState<Playlist | undefined | null>(
		playlists?.[0] ?? undefined,
	)
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)

	const totalPlaylists = playlists?.length ?? 0
	const pageMax = Math.ceil(totalPlaylists / playlistPerPage)

	const indexOfLastPlaylist = currentPage * playlistPerPage
	const indexOfFirstPlaylist = indexOfLastPlaylist - playlistPerPage
	const currentPlaylist =
		playlists?.slice(indexOfFirstPlaylist, indexOfLastPlaylist) ?? []

	const onAuth = async () => {
		const url = await getAuthUrl()
		if (url.status === 200) {
			window.location.href = url.response
		} else {
			setError(url)
		}
	}

	const onPlaylist = async () => {
		setIsLoading(true)
		const res = await createPlaylistAction()
		if (res.status === 200) {
			setIsSuccessPopupOpen(true)
		} else {
			setError(res)
		}
		setIsLoading(false)
	}

	return (
		<div className="flex flex-col items-center justify-center gap-y-2">
			<h1 className="text-2xl font-bold">Youtube動画管理</h1>
			<p className="text-sm text-center">
				このページではYoutubeに上がってる動画を取得するためのページです。
				<br />
				Youtube認証が必要な可能性があるので、あしたぼのアカウントにログインしている人が操作をしてください。
				<br />
				気が向いたら自動化します。
			</p>
			<button
				className="btn btn-primary btn-outline"
				onClick={onAuth}
				disabled={isAccessToken}
			>
				Youtube認証
			</button>
			<div className="flex flex-row gap-x-2">
				<button className="btn btn-primary" onClick={onPlaylist}>
					{isLoading ? '処理中...' : 'Youtubeから取得'}
				</button>
				<button
					className="btn btn-secondary btn-outline"
					onClick={async () => {
						await revalidateYoutubeTag()
					}}
				>
					更新
				</button>
			</div>
			{error && (
				<p className="text-error text-center">
					エラーコード{error.status}:{error.response}
				</p>
			)}

			<div className="overflow-x-auto w-full flex flex-col justify-center gap-y-2">
				<div className="flex flex-row items-center justify-between">
					<div className="text-sm">
						更新日:{' '}
						{playlists?.[0]?.updatedAt
							? format(new Date(playlists[0].updatedAt), 'yyyy/MM/dd', {
									locale: ja,
								})
							: '不明'}
					</div>
					<div className="flex flex-row items-center">
						<p className="text-sm whitespace-nowrap">表示件数:</p>
						<SelectField
							value={playlistPerPage}
							onChange={(e) => {
								setPlaylistPerPage(Number(e.target.value))
								setCurrentPage(1)
							}}
							options={{ 10: '10件', 20: '20件', 50: '50件', 100: '100件' }}
							name="usersPerPage"
						/>
					</div>
				</div>
				<table className="table table-zebra table-sm w-full max-w-36 justify-center">
					<thead>
						<tr>
							<th>タイトル</th>
							<th>タグ</th>
						</tr>
					</thead>
					<tbody>
						{currentPlaylist.map((playlist) => (
							<tr
								key={playlist.playlistId}
								onClick={() => {
									setPopupData(playlist)
									setIsPopupOpen(true)
								}}
							>
								<td>{playlist.title}</td>
								<td>
									{playlist.tags ? <Tags tags={playlist.tags} /> : undefined}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="join justify-center">
				{Array.from({ length: pageMax }, (_, i) => (
					<button
						key={i}
						className={`join-item btn ${
							currentPage === i + 1 ? 'btn-primary' : 'btn-outline'
						}`}
						onClick={() => setCurrentPage(i + 1)}
					>
						{i + 1}
					</button>
				))}
			</div>
			<div className="flex flex-row justify-center mt-2">
				<button
					className="btn btn-outline"
					onClick={() => router.push('/admin')}
				>
					戻る
				</button>
			</div>
			<Popup
				ref={successPopupRef}
				title="成功"
				open={isSuccessPopupOpen}
				onClose={() => setIsSuccessPopupOpen(false)}
			>
				<button onClick={() => setIsSuccessPopupOpen(false)}>閉じる</button>
			</Popup>
			<Popup
				ref={popupRef}
				title="プレイリスト詳細"
				open={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
			>
				<div className="flex flex-col gap-y-2 text-sm">
					<div className="flex flex-col gap-y-2">
						<div className="flex flex-row gap-x-1">
							<div className="font-bold basis-1/4">プレイリストID:</div>
							<div className="basis-3/4">{popupData?.playlistId}</div>
						</div>
						<div className="flex flex-row gap-x-1">
							<div className="font-bold basis-1/4">タイトル:</div>
							<div className="basis-3/4">{popupData?.title}</div>
						</div>
						<div className="flex flex-row gap-x-1">
							<div className="font-bold basis-1/4">リンク:</div>
							<div className="basis-3/4">
								<a href={popupData?.link} target="_blank" rel="noreferrer">
									{popupData?.link}
								</a>
							</div>
						</div>
						<div className="flex flex-row gap-x-1">
							<div className="font-bold basis-1/4">タグ:</div>
							<div className="basis-3/4">
								{popupData?.tags ? (
									<Tags tags={popupData.tags} size="text-sm" />
								) : undefined}
							</div>
						</div>
						<div className="flex flex-row gap-x-1">
							<div className="font-bold basis-1/4">作成日:</div>
							<div className="basis-3/4">
								{popupData?.createdAt
									? format(new Date(popupData.createdAt), 'yyyy年MM月dd日', {
											locale: ja,
										})
									: '不明'}
							</div>
						</div>
						<div className="flex flex-row gap-x-1">
							<div className="font-bold basis-1/4">更新日:</div>
							<div className="basis-3/4">
								{popupData?.updatedAt
									? format(new Date(popupData.updatedAt), 'yyyy年MM月dd日', {
											locale: ja,
										})
									: '不明'}
							</div>
						</div>
					</div>
					<div className="flex flex-row justify-center gap-x-2">
						<button
							className="btn btn-primary"
							onClick={() => {
								setIsPopupOpen(false)
							}}
						>
							閉じる
						</button>
					</div>
				</div>
			</Popup>
		</div>
	)
}

export default YoutubeManagement
