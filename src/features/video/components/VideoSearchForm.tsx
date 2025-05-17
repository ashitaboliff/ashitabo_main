'use client'

import { useRef, useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { YoutubeSearchQuery } from '@/features/video/types'
import ShareButton from '@/components/ui/atoms/ShareButton'
import TextSearchField from '@/components/ui/molecules/TextSearchField'
import TagInputField from '@/components/ui/molecules/TagsInputField'
import Popup, { PopupRef } from '@/components/ui/molecules/Popup'
import { BiSearch } from 'react-icons/bi'
import { RiQuestionLine } from 'react-icons/ri'

type Props = {
	defaultQuery: YoutubeSearchQuery
	isSearching: boolean
	onSearch: (query: Partial<YoutubeSearchQuery>) => void
}

const VideoSearchForm = ({ defaultQuery, isSearching, onSearch }: Props) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [isPopupOpen, setIsPopupOpen] = useState(false)
	const popupRef = useRef<PopupRef>()
	const [isUsagePopupOpen, setIsUsagePopupOpen] = useState(false)
	const usagePopupRef = useRef<PopupRef>()
	const [formKey, setFormKey] = useState<number>(0)
	const [currentTags, setCurrentTags] = useState<string[]>(
		(searchParams.getAll('tag') as string[]) ?? defaultQuery.tag ?? [],
	)
	const [tagSearchMode, setTagSearchMode] = useState<'and' | 'or'>(
		(searchParams.get('tagSearchMode') as 'and' | 'or') ??
			defaultQuery.tagSearchMode ??
			'or',
	)

	const getCurrentQuery = (): YoutubeSearchQuery => {
		const params = new URLSearchParams(searchParams.toString())
		return {
			liveOrBand:
				(params.get('liveOrBand') as 'live' | 'band') ??
				defaultQuery.liveOrBand,
			bandName: params.get('bandName') ?? defaultQuery.bandName,
			liveName: params.get('liveName') ?? defaultQuery.liveName,
			tag: currentTags,
			tagSearchMode: tagSearchMode,
			sort: (params.get('sort') as 'new' | 'old') ?? defaultQuery.sort,
			page: Number(params.get('page')) || defaultQuery.page,
			videoPerPage:
				Number(params.get('videoPerPage')) || defaultQuery.videoPerPage,
		}
	}

	const currentQuery = getCurrentQuery() // これはフォームのdefaultValue用

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		setIsPopupOpen(false)
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const newQuery: Partial<YoutubeSearchQuery> = {
			liveOrBand: formData.get('liveOrBand') as 'live' | 'band',
			bandName: formData.get('bandName') as string,
			liveName: formData.get('liveName') as string,
			tag: currentTags,
			tagSearchMode: formData.get('tagSearchMode') as 'and' | 'or',
		}
		onSearch({ ...newQuery, page: 1 })
	}

	const handleReset = () => {
		setFormKey((prev) => prev + 1)
		setCurrentTags(defaultQuery.tag || [])
		setTagSearchMode(defaultQuery.tagSearchMode || 'or')
		setIsPopupOpen(false)
		router.replace('/video')
		onSearch(defaultQuery)
	}

	useEffect(() => {
		const tagsFromParams = searchParams.getAll('tag')
		const modeFromParams = searchParams.get('tagSearchMode') as 'and' | 'or'

		// URLパラメータに基づいて内部状態を更新
		if (tagsFromParams.length > 0 || searchParams.has('tag')) {
			setCurrentTags(tagsFromParams)
		} else if (
			!searchParams.has('bandName') &&
			!searchParams.has('liveName') &&
			!searchParams.has('liveOrBand') &&
			!searchParams.has('tag') // tagパラメータもないことを明確化
		) {
			setCurrentTags(defaultQuery.tag || [])
		}

		if (modeFromParams) {
			setTagSearchMode(modeFromParams)
		} else if (
			!searchParams.has('bandName') &&
			!searchParams.has('liveName') &&
			!searchParams.has('liveOrBand') &&
			!searchParams.has('tagSearchMode') // tagSearchModeパラメータもないことを明確化
		) {
			setTagSearchMode(defaultQuery.tagSearchMode || 'or')
		}
	}, [searchParams, defaultQuery.tag, defaultQuery.tagSearchMode])

	const handleTagsChange = (newTags: string[]) => {
		setCurrentTags(newTags)
	}

	const handleTagModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTagSearchMode(e.target.value as 'and' | 'or')
	}

	return (
		<>
			<div className="flex flex-row items-center justify-center gap-x-2 py-2">
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
						<BiSearch size={25} />
						条件検索
					</div>
				</button>
				<ShareButton
					title="ライブ映像をシェアする"
					text="あしたぼライブ映像を共有しよう"
					url={`${pathname}?${searchParams.toString()}`}
				/>
			</div>
			<Popup
				id="video-search-popup"
				ref={popupRef}
				title="条件検索"
				open={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
			>
				<form
					key={formKey} // key を使うことでフォーム内の defaultValue をリセット時に正しく反映
					onSubmit={handleSubmit}
					className="flex flex-col gap-y-2 justify-center max-w-sm m-auto"
				>
					<div className="flex flex-row justify-center gap-x-2">
						<input
							type="radio"
							name="liveOrBand"
							value="live"
							defaultChecked={currentQuery.liveOrBand === 'live'}
							className="btn btn-tetiary w-5/12"
							aria-label="再生リスト"
						/>
						<input
							type="radio"
							name="liveOrBand"
							value="band"
							defaultChecked={currentQuery.liveOrBand === 'band'}
							className="btn btn-tetiary w-5/12"
							aria-label="動画"
						/>
					</div>
					<TextSearchField
						label="バンド名"
						infoDropdown="Youtubeの動画タイトルになっているバンド名での検索です"
						name="bandName"
						placeholder="バンド名"
						defaultValue={currentQuery.bandName}
					/>
					<TextSearchField
						label="ライブ名"
						infoDropdown="Youtubeのプレイリストタイトルになっているライブ名での検索です"
						name="liveName"
						placeholder="ライブ名"
						defaultValue={currentQuery.liveName}
					/>
					<TagInputField
						label="タグ"
						infoDropdown="みんなのつけたタグによる検索です"
						name="tag" // nameは引き続き必要（HTMLのname属性として、または将来的なRHF化のため）
						placeholder="タグを入力しEnterかカンマで追加"
						defaultValue={currentTags}
						onChange={handleTagsChange} // このonChangeでcurrentTagsを更新
					/>
					<div className="form-control mt-1 flex-row gap-x-2">
						<label className="label cursor-pointer justify-start gap-2">
							<span className="label-text text-xs">タグ検索モード:</span>
							<input
								type="radio"
								name="tagSearchMode"
								className="radio radio-xs"
								value="or"
								checked={tagSearchMode === 'or'}
								onChange={handleTagModeChange}
							/>
							<span className="label-text text-xs">いずれかを含む (OR)</span>
						</label>
						<label className="label cursor-pointer justify-start gap-2">
							<span className="label-text text-xs"></span>
							<input
								type="radio"
								name="tagSearchMode"
								className="radio radio-xs"
								value="and"
								checked={tagSearchMode === 'and'}
								onChange={handleTagModeChange}
							/>
							<span className="label-text text-xs">すべてを含む (AND)</span>
						</label>
					</div>
					<button type="submit" className="btn btn-primary mt-2">
						検索
					</button>
					<div className="flex flex-row justify-center gap-x-2">
						<button
							type="button"
							className="btn btn-outline w-1/2"
							onClick={handleReset}
						>
							リセット
						</button>
						<button
							type="button"
							className="btn btn-outline w-1/2"
							onClick={() => setIsPopupOpen(false)}
						>
							閉じる
						</button>
					</div>
				</form>
			</Popup>
			<Popup
				id="video-search-usage-popup"
				ref={usagePopupRef}
				title="条件検索の使い方"
				open={isUsagePopupOpen}
				onClose={() => setIsUsagePopupOpen(false)}
			>
				<div className="flex flex-col gap-y-2">
					<div className="text-base gap">
						<div className="my-2">
							<p className="font-bold text-lg">ライブ名: </p>
							Youtubeのプレイリストタイトルになっているライブ名での検索です
						</div>
						<div className="my-2">
							<p className="font-bold text-lg">バンド名: </p>
							Youtubeの動画タイトルになっているバンド名での検索です
						</div>
						<div className="my-2">
							<p className="font-bold text-lg">タグ: </p>
							みんなのつけたタグによる検索です。自分の名前やバンドの正式名称、
							「<span className="text-info">#わたべのお気に入り</span>
							」など好きな名前をつけて共有してみるといいです
						</div>
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
		</>
	)
}

export default VideoSearchForm
