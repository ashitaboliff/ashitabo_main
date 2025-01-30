'use client'

import LocalFont from 'next/font/local'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { YoutubeDetail, YoutubeSearchQuery } from '@/types/YoutubeTypes'
import { ErrorType } from '@/types/ResponseTypes'
import ShareButton from '@/components/atoms/ShareButton'
import SelectFieldNumber from '@/components/atoms/SelectFieldNumber'
import Pagination from '@/components/atoms/Pagination'
import TextSearchField from '@/components/molecules/TextSearchField'
import TagInputField from '@/components/molecules/TagsInputField'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import YoutubeDetailBox from '@/components/video/YoutubeDetailBox'
import { searchYoutubeDetailsAction } from './actions'

import { VscSettings } from 'react-icons/vsc'
import { RiQuestionLine } from 'react-icons/ri'

const gkktt = LocalFont({
	src: '../../lib/fonts/851Gkktt_005.woff',
	weight: 'normal',
	style: 'normal',
	variable: '--851-gkktt',
})

const defaultSearchQuery: YoutubeSearchQuery = {
	liveOrBand: 'live',
	bandName: '',
	liveName: '',
	sort: 'new',
	page: 1,
	videoPerPage: 10,
}

const YoutubeMainPage = () => {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [query, setQuery] = useState<YoutubeSearchQuery>(defaultSearchQuery)
	const [pageMax, setPageMax] = useState<number>(1)
	const [youtubeDetails, setYoutubeDetails] = useState<YoutubeDetail[]>([])
	const [isSearching, setIsSearching] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<PopupRef>()
	const [isUsagePopupOpen, setIsUsagePopupOpen] = useState<boolean>(false)
	const usagePopupRef = useRef<PopupRef>()
	const [error, setError] = useState<ErrorType>()

	// 初回読み込み時に searchParams を取得してクエリを設定
	useEffect(() => {
		const initialQuery: YoutubeSearchQuery = {
			liveOrBand:
				(searchParams.get('liveOrBand') as 'live' | 'band') ??
				defaultSearchQuery.liveOrBand,
			bandName: searchParams.get('bandName') ?? defaultSearchQuery.bandName,
			liveName: searchParams.get('liveName') ?? defaultSearchQuery.liveName,
			tag: (searchParams.getAll('tag') as string[]) ?? defaultSearchQuery.tag,
			sort:
				(searchParams.get('sort') as 'new' | 'old') ?? defaultSearchQuery.sort,
			page: Number(searchParams.get('page')) || defaultSearchQuery.page,
			videoPerPage:
				Number(searchParams.get('videoPerPage')) ||
				defaultSearchQuery.videoPerPage,
		}
		setQuery(initialQuery)
		executeSearch(initialQuery)
	}, [])

	// 検索を実行する関数
	const executeSearch = async (query: YoutubeSearchQuery) => {
		setIsSearching(true)
		setIsLoading(true)
		const res = await searchYoutubeDetailsAction(query)
		if (res.status === 200) {
			setYoutubeDetails(res.response.results)
			setPageMax(Math.ceil(res.response.totalCount / query.videoPerPage))
		} else {
			setError({
				status: res.status,
				response: String(res.response),
			})
		}
		setIsLoading(false)
	}

	// クエリを更新し、searchParams に反映
	const updateQuery = (newQuery: Partial<YoutubeSearchQuery>) => {
		const updatedQuery = { ...query, ...newQuery }
		setQuery(updatedQuery)

		const newParams = new URLSearchParams()
		if (updatedQuery.liveOrBand)
			newParams.set('liveOrBand', updatedQuery.liveOrBand)
		if (updatedQuery.bandName) newParams.set('bandName', updatedQuery.bandName)
		if (updatedQuery.liveName) newParams.set('liveName', updatedQuery.liveName)
		if (updatedQuery.tag?.length !== 0 && updatedQuery.tag)
			updatedQuery.tag.forEach((tag) => newParams.append('tag', tag))
		if (updatedQuery.sort) newParams.set('sort', updatedQuery.sort)
		if (updatedQuery.page) newParams.set('page', String(updatedQuery.page))
		if (updatedQuery.videoPerPage)
			newParams.set('videoPerPage', String(updatedQuery.videoPerPage))

		router.replace(`/video?${newParams.toString()}`)
		executeSearch(updatedQuery)
	}

	// フォーム送信時の処理
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		setIsPopupOpen(false)
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const newQuery: Partial<YoutubeSearchQuery> = {
			liveOrBand: formData.get('liveOrBand') as 'live' | 'band',
			bandName: formData.get('bandName') as string,
			liveName: formData.get('liveName') as string,
			tag: formData.getAll('tag') as string[],
		}
		updateQuery({ ...newQuery, page: 1 }) // ページをリセット
	}

	return (
		<div className="flex flex-col justify-center items-center gap-y-4 mt-6">
			<div className={`text-3xl font-bold ${gkktt.className}`}>
				過去ライブ映像
			</div>
			<div className="flex flex-row items-center justify-between gap-x-2">
				<button
					className="btn btn-ghost w-16"
					onClick={() => setIsUsagePopupOpen(true)}
				>
					<RiQuestionLine size={25} />
				</button>
				<button
					className={`btn btn-outline w-64 ${isSearching ? 'btn-tetiary' : ''}`}
					onClick={() => setIsPopupOpen(true)}
				>
					<div className="flex flex-row items-center space-x-2">
						<VscSettings size={25} />
						条件検索
					</div>
				</button>
				<ShareButton
					title="ライブ映像をシェアする"
					text="あしたぼライブ映像を共有しよう"
					url={window.location.href}
				/>
			</div>
			<div className="flex flex-col items-center justify-center gap-y-2">
				<div className="flex flex-row items-center ml-auto space-x-2 w-1/2">
					<p className="text-sm whitespace-nowrap">表示件数:</p>
					<SelectFieldNumber
						value={query.videoPerPage}
						onChange={(e) =>
							updateQuery({ videoPerPage: Number(e.target.value), page: 1 })
						}
						options={{ '10件': 10, '20件': 20, '30件': 30 }}
						name="videoPerPage"
					/>
				</div>
				<div className="flex flex-col gap-y-2">
					<div className="flex flex-row gap-x-2">
						<input
							type="radio"
							name="sort"
							value="new"
							defaultChecked={query.sort === 'new'}
							className="btn btn-tetiary btn-sm"
							aria-label="新しい順"
							onChange={() => updateQuery({ sort: 'new' })}
						/>
						<input
							type="radio"
							name="sort"
							value="old"
							defaultChecked={query.sort === 'old'}
							className="btn btn-tetiary btn-sm"
							aria-label="古い順"
							onChange={() => updateQuery({ sort: 'old' })}
						/>
					</div>
					{error && (
						<p className="text-sm text-error text-center">
							エラーコード{error.status}:{error.response}
						</p>
					)}

					{isLoading ? (
						<>
							<div className="flex flex-col items-center">
								<div className="skeleton h-52 w-92"></div>
								<div className="flex flex-col gap-y-1 mt-1">
									<div className="skeleton h-6 w-92"></div>
									<div className="skeleton h-5 w-92"></div>
									<div className="skeleton h-5 w-92"></div>
									<div className="flex flex-row gap-x-2">
										<div className="skeleton h-5 w-8"></div>
										<div className="skeleton h-5 w-8"></div>
									</div>
								</div>
							</div>
							<div className="flex flex-col items-center">
								<div className="skeleton h-52 w-92"></div>
								<div className="flex flex-col gap-y-1 mt-1">
									<div className="skeleton h-6 w-92"></div>
									<div className="skeleton h-5 w-92"></div>
									<div className="skeleton h-5 w-92"></div>
									<div className="flex flex-row gap-x-2">
										<div className="skeleton h-5 w-8"></div>
										<div className="skeleton h-5 w-8"></div>
									</div>
								</div>
							</div>
							<div className="flex flex-col items-center">
								<div className="skeleton h-52 w-92"></div>
								<div className="flex flex-col gap-y-1 mt-1">
									<div className="skeleton h-6 w-92"></div>
									<div className="skeleton h-5 w-92"></div>
									<div className="skeleton h-5 w-92"></div>
									<div className="flex flex-row gap-x-2">
										<div className="skeleton h-5 w-8"></div>
										<div className="skeleton h-5 w-8"></div>
									</div>
								</div>
							</div>
						</>
					) : (
						youtubeDetails.map((youtubeDetail) => (
							<YoutubeDetailBox
								key={youtubeDetail.id}
								youtubeDetail={youtubeDetail}
								liveOrBand={query.liveOrBand}
							/>
						))
					)}
					{youtubeDetails.length === 0 && !isLoading && (
						<div className="text-base-content w-92 text-center">
							該当する動画がありません
						</div>
					)}
				</div>
				<Pagination
					currentPage={query.page}
					totalPages={pageMax}
					onPageChange={(page) => updateQuery({ page })}
				/>
			</div>
			<Popup
				ref={popupRef}
				title="条件検索"
				open={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
			>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-y-2 justify-center max-w-sm m-auto"
				>
					<div className="flex flex-row justify-center gap-x-2">
						<input
							type="radio"
							name="liveOrBand"
							value="live"
							defaultChecked={query.liveOrBand === 'live'}
							className="btn btn-tetiary"
							aria-label="ライブを検索"
						/>
						<input
							type="radio"
							name="liveOrBand"
							value="band"
							defaultChecked={query.liveOrBand === 'band'}
							className="btn btn-tetiary"
							aria-label="バンドを検索"
						/>
					</div>
					<TextSearchField
						label="バンド名"
						infoDropdown="Youtubeの動画タイトルになっているバンド名での検索です"
						name="bandName"
						placeholder="バンド名"
						defaultValue={query.bandName}
					/>
					<TextSearchField
						label="ライブ名"
						infoDropdown="Youtubeのプレイリストタイトルになっているライブ名での検索です"
						name="liveName"
						placeholder="ライブ名"
						defaultValue={query.liveName}
					/>
					<TagInputField
						label="タグ"
						infoDropdown="みんなのつけたタグによる検索です"
						name="tag"
						placeholder="タグ"
						defaultValue={query.tag}
					/>
					<div className="flex flex-row justify-center gap-x-2"></div>
					<div className="flex flex-row justify-center gap-x-2">
						<button type="submit" className="btn btn-primary">
							検索
						</button>
						<button
							type="button"
							className="btn btn-outline"
							onClick={() => {
								setQuery(defaultSearchQuery)
								updateQuery(defaultSearchQuery)
								setIsPopupOpen(false)
							}}
						>
							リセット
						</button>
					</div>
					<button
						type="button"
						className="btn btn-outline"
						onClick={() => setIsPopupOpen(false)}
					>
						閉じる
					</button>
				</form>
			</Popup>
			<Popup
				ref={usagePopupRef}
				title="条件検索の使い方"
				open={isUsagePopupOpen}
				onClose={() => setIsUsagePopupOpen(false)}
			>
				<div className="flex flex-col gap-y-2">
					<div className="text-base gap">
						<p className="my-2">
							<p className="font-bold text-lg">ライブ名: </p>Youtube
							のプレイリストタイトルになっているライブ名での検索です
						</p>
						<p className="my-2">
							<p className="font-bold text-lg">バンド名: </p>Youtube
							の動画タイトルになっているバンド名での検索です
						</p>
						<p className="my-2">
							<p className="font-bold text-lg">タグ: </p>
							みんなのつけたタグによる検索です。自分の名前やバンドの正式名称、「
							<span className="text-info">#わたべのお気に入り</span>
							」など好きな名前をつけて共有とかしてみるといいです
						</p>
					</div>
					<div className="flex flex-row justify-center gap-x-2">
						<button
							type="button"
							className="btn btn-outline"
							onClick={() => setIsUsagePopupOpen(false)}
						>
							閉じる
						</button>
					</div>
				</div>
			</Popup>
		</div>
	)
}

export default YoutubeMainPage
