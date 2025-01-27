'use client'

import LocalFont from 'next/font/local'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { YoutubeDetail, YoutubeSearchQuery } from '@/types/YoutubeTypes'
import SelectFieldNumber from '@/components/atoms/SelectFieldNumber'
import Pagination from '@/components/atoms/Pagination'
import TextSearchField from '@/components/molecules/TextSearchField'
import TagInputField from '@/components/molecules/TagsInputField'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import YoutubeDetailBox from '@/components/video/YoutubeDetailBox'
import { searchYoutubeDetailsAction } from './actions'

import { VscSettings } from 'react-icons/vsc'

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
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<PopupRef>(null)

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
			console.error('Failed to get youtube details')
			console.error(res)
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
			<button
				className={`btn btn-outline w-80 ${isSearching ? 'btn-tetiary' : ''}`}
				onClick={() => setIsPopupOpen(true)}
			>
				<div className="flex flex-row items-center space-x-2">
					<VscSettings size={25} />
					条件検索
				</div>
			</button>
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
						name="bandName"
						placeholder="バンド名"
						defaultValue={query.bandName}
					/>
					<TextSearchField
						name="liveName"
						placeholder="ライブ名"
						defaultValue={query.liveName}
					/>
					<TagInputField
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
		</div>
	)
}

export default YoutubeMainPage
