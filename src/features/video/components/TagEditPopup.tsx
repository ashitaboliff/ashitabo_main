'use client'

import { useRef, useState, useEffect } from 'react' // useEffect を追加
import { useForm } from 'react-hook-form'
import { useRouter } from 'next-nprogress-bar'
import { Session } from 'next-auth'
import { liveOrBand } from '@/features/video/types'
import { ErrorType } from '@/utils/types/responseTypes'
import TagInputField from '@/components/ui/molecules/TagsInputField'
import Popup, { PopupRef } from '@/components/ui/molecules/Popup'
import { updateTagsAction } from './actions'
import { TbEdit } from 'react-icons/tb'

type Props = {
	session: Session | null
	id: string
	currentTags: string[] | undefined
	liveOrBand: liveOrBand
	isFullButton?: boolean
}

const TagEditPopup = ({
	session,
	id,
	currentTags,
	liveOrBand,
	isFullButton,
}: Props) => {
	const router = useRouter()
	const [isPopupOpen, setIsPopupOpen] = useState(false)
	const [isSessionPopupOpen, setIsSessionPopupOpen] = useState(false)
	const [error, setError] = useState<ErrorType>()
	const popupRef = useRef<PopupRef>()
	const sessionPopupRef = useRef<PopupRef>()

	const { handleSubmit, control, reset, setValue } = useForm<{
		tags: string[]
	}>({
		defaultValues: {
			tags: currentTags || [],
		},
	})

	useEffect(() => {
		reset({ tags: currentTags || [] })
	}, [currentTags, reset])

	const onSubmit = async (data: { tags: string[] }) => {
		const res = await updateTagsAction(id, data.tags, liveOrBand)
		if (res.status === 200) {
			setIsPopupOpen(false)
			router.refresh()
		} else {
			setError(res)
		}
	}

	const handleOpenEditPopup = () => {
		if (!session) {
			setIsSessionPopupOpen(true)
		} else {
			reset({ tags: currentTags || [] })
			setIsPopupOpen(true)
		}
	}

	return (
		<>
			<button
				className="btn btn-outline btn-primary btn-sm text-xs-custom xl:text-sm"
				onClick={handleOpenEditPopup}
			>
				<TbEdit size={15} />
				{isFullButton ? ' タグを編集' : ''}
			</button>
			<Popup
				id={`tag-edit-popup-${id}`}
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
						name="tags"
						control={control}
						label="タグ"
						placeholder="タグを追加"
						defaultValue={currentTags || []}
					/>
					<div className="flex flex-row justify-center gap-x-2 mt-2">
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
						<div className="text-error text-sm text-center mt-2">
							{error.response}
						</div>
					)}
				</form>
			</Popup>
			<Popup
				id={`session-popup-${id}`}
				ref={sessionPopupRef}
				title="利用登録が必要です"
				open={isSessionPopupOpen}
				onClose={() => setIsSessionPopupOpen(false)}
			>
				<div className="flex flex-col gap-y-2 justify-center max-w-sm m-auto">
					<div className="text-sm text-center">
						タグ編集を行うには利用登録が必要です
					</div>
					<div className="flex flex-row justify-center gap-x-2 mt-2">
						<button
							type="button"
							className="btn btn-primary"
							onClick={() => {
								router.push('/auth/signin')
							}}
						>
							ログイン
						</button>
						<button
							type="button"
							className="btn btn-outline"
							onClick={() => {
								setIsSessionPopupOpen(false)
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

export default TagEditPopup
