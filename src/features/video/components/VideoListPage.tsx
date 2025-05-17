'use client'

import LocalFont from 'next/font/local'
import { useState, useTransition, useEffect } from 'react' // useEffect をインポート
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react' // useSession をインポート
import { YoutubeDetail, YoutubeSearchQuery } from '@/features/video/types'
import { ErrorType } from '@/utils/types/responseTypes'
import SelectFieldNumber from '@/components/ui/atoms/SelectFieldNumber'
import Pagination from '@/components/ui/atoms/Pagination'
import VideoItem from '@/features/video/components/VideoItem'
import VideoSearchForm from '@/features/video/components/VideoSearchForm'

const gkktt = LocalFont({
	src: '../../../lib/fonts/851Gkktt_005.woff',
	weight: 'normal',
	style: 'normal',
	variable: '--851-gkktt',
})

const defaultSearchQuery: YoutubeSearchQuery = {
	liveOrBand: 'band',
	bandName: '',
	liveName: '',
	tag: [],
	tagSearchMode: 'or', // デフォルトはOR検索
	sort: 'new',
	page: 1,
	videoPerPage: 15,
}

// URLSearchParamsをYoutubeSearchQueryに変換するヘルパー関数
const parseSearchParams = (params: URLSearchParams): YoutubeSearchQuery => {
	return {
		liveOrBand:
			(params.get('liveOrBand') as 'live' | 'band') ??
			defaultSearchQuery.liveOrBand,
		bandName: params.get('bandName') ?? defaultSearchQuery.bandName,
		liveName: params.get('liveName') ?? defaultSearchQuery.liveName,
		tag: (params.getAll('tag') as string[]) ?? defaultSearchQuery.tag,
		tagSearchMode:
			(params.get('tagSearchMode') as 'and' | 'or') ??
			defaultSearchQuery.tagSearchMode,
		sort: (params.get('sort') as 'new' | 'old') ?? defaultSearchQuery.sort,
		page: Number(params.get('page')) || defaultSearchQuery.page,
		videoPerPage:
			Number(params.get('videoPerPage')) || defaultSearchQuery.videoPerPage,
	}
}

interface VideoListPageProps {
	initialYoutubeDetails: YoutubeDetail[]
	initialPageMax: number
	initialIsLoading: boolean // Or handle loading with Suspense in parent
	initialError?: ErrorType
	// currentQuery will be derived from searchParams inside, but initial values might be passed if needed
}

const VideoListPage = ({
	initialYoutubeDetails,
	initialPageMax,
	initialIsLoading,
	initialError,
}: VideoListPageProps) => {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const router = useRouter()
	const { data: session } = useSession() // session を取得
	const [pageMax, setPageMax] = useState<number>(initialPageMax)
	const [youtubeDetails, setYoutubeDetails] = useState<YoutubeDetail[]>(
		initialYoutubeDetails,
	)
	const [isLoading, setIsLoading] = useState<boolean>(initialIsLoading)
	const [error, setError] = useState<ErrorType | undefined>(initialError)
	const [isPending, startTransition] = useTransition()
	// const [isTagModalOpen, setIsTagModalOpen] = useState(false) // TagEditPopup側で管理するため不要
	const [selectedVideoForTagEdit, setSelectedVideoForTagEdit] =
		useState<YoutubeDetail | null>(null)

	// Propsの変更を検知してステートを更新
	useEffect(() => {
		setYoutubeDetails(initialYoutubeDetails)
	}, [initialYoutubeDetails])

	useEffect(() => {
		setPageMax(initialPageMax)
	}, [initialPageMax])

	useEffect(() => {
		setIsLoading(initialIsLoading)
	}, [initialIsLoading])

	useEffect(() => {
		setError(initialError)
	}, [initialError])

	const currentQuery = parseSearchParams(searchParams)
	const isSearching = searchParams.toString() !== ''

	const updateQueryAndNavigate = (
		newQueryParts: Partial<YoutubeSearchQuery>,
	) => {
		const newParams = new URLSearchParams(searchParams.toString())

		Object.entries(newQueryParts).forEach(([key, value]) => {
			if (key === 'tag' && Array.isArray(value)) {
				newParams.delete(key) // 既存のtagを削除
				if (value.length > 0) {
					value.forEach((t) => newParams.append(key, t))
				}
			} else if (value !== undefined && value !== null && value !== '') {
				newParams.set(key, String(value))
			} else {
				newParams.delete(key) // 値が空の場合はパラメータを削除
			}
		})

		// デフォルト値と同じ場合はパラメータを削除する
		Object.entries(defaultSearchQuery).forEach(([key, defaultValue]) => {
			if (newParams.has(key)) {
				if (key === 'tag') {
					const tags = newParams.getAll(key)
					if (
						tags.length === 0 ||
						(tags.length === 1 && tags[0] === '') ||
						JSON.stringify(tags) === JSON.stringify(defaultValue)
					) {
						newParams.delete(key)
					}
				} else if (String(newParams.get(key)) === String(defaultValue)) {
					newParams.delete(key)
				}
			}
		})
		router.replace(`${pathname}?${newParams.toString()}`)
		router.refresh()
	}

	const handleSearch = (searchQuery: Partial<YoutubeSearchQuery>) => {
		updateQueryAndNavigate({ ...searchQuery, page: 1 })
	}

	return (
		<div className="container mx-auto px-2 sm:px-4 py-6">
			<div
				className={`text-3xl sm:text-4xl font-bold ${gkktt.className} text-center mb-6`}
			>
				過去ライブ映像
			</div>
			<VideoSearchForm
				defaultQuery={defaultSearchQuery}
				isSearching={isSearching}
				onSearch={handleSearch}
			/>
			<div className="flex flex-col items-center justify-center gap-y-4">
				<div className="flex flex-row items-center justify-end w-full gap-2 sm:gap-4 mb-2 px-1">
					<div className="flex items-center space-x-2">
						<p className="text-xs-custom sm:text-sm whitespace-nowrap">
							表示件数:
						</p>
						<SelectFieldNumber
							value={currentQuery.videoPerPage}
							onChange={(e) =>
								updateQueryAndNavigate({
									videoPerPage: Number(e.target.value),
									page: 1,
								})
							}
							options={{ '15件': 15, '20件': 20, '30件': 30 }}
							name="videoPerPage"
						/>
					</div>
					<div className="flex items-center space-x-2">
						<p className="text-xs-custom sm:text-sm whitespace-nowrap">
							並び順:
						</p>
						<div className="flex flex-row gap-x-1 sm:gap-x-2">
							<input
								type="radio"
								name="sort"
								value="new"
								checked={currentQuery.sort === 'new'}
								className="btn btn-tetiary btn-xs sm:btn-sm"
								aria-label="新しい順"
								onChange={() => updateQueryAndNavigate({ sort: 'new' })}
							/>
							<input
								type="radio"
								name="sort"
								value="old"
								checked={currentQuery.sort === 'old'}
								className="btn btn-tetiary btn-xs sm:btn-sm"
								aria-label="古い順"
								onChange={() => updateQueryAndNavigate({ sort: 'old' })}
							/>
						</div>
					</div>
				</div>

				{error && (
					<p className="text-sm text-error text-center">
						エラーコード{error.status}:{error.response}
					</p>
				)}

				{isLoading || isPending ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
						{[...Array(currentQuery.videoPerPage)].map((_, i) => (
							<div
								key={i}
								className="flex flex-col items-center p-4 border rounded-lg shadow-sm w-full"
							>
								<div className="skeleton h-48 w-full mb-2"></div>
								<div className="skeleton h-6 w-3/4 mb-1"></div>
								<div className="skeleton h-5 w-1/2 mb-1"></div>
								<div className="skeleton h-5 w-1/3"></div>
							</div>
						))}
					</div>
				) : youtubeDetails.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
						{youtubeDetails.map((youtubeDetail) => (
							<VideoItem
								session={session}
								key={youtubeDetail.id}
								youtubeDetail={youtubeDetail}
								liveOrBand={currentQuery.liveOrBand}
							/>
						))}
					</div>
				) : (
					<div className="text-base-content w-full text-center py-10">
						該当する動画がありません
					</div>
				)}
				{pageMax > 1 && (
					<Pagination
						currentPage={currentQuery.page}
						totalPages={pageMax}
						onPageChange={(page) => updateQueryAndNavigate({ page })}
					/>
				)}
			</div>
		</div>
	)
}

export default VideoListPage
