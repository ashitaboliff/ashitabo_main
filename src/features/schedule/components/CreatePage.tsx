'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { v4 } from 'uuid'
import { format, eachDayOfInterval } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Session } from 'next-auth'
import { DateToDayISOstring } from '@/utils'
import { ErrorType } from '@/utils/types/responseTypes'
import ShareButton from '@/components/ui/atoms/ShareButton'
import CustomDatePicker from '@/components/ui/atoms/DatePicker'
import TextInputField from '@/components/ui/atoms/TextInputField'
import TextareaInputField from '@/components/ui/atoms/TextareaInputField'
import SelectField from '@/components/ui/atoms/SelectField'
import Popup, { PopupRef } from '@/components/ui/molecules/Popup'
import { getUserIdWithNames, createScheduleAction } from './actions'

const ScheduleCreateSchema = yup.object().shape({
	startDate: yup.date().required('日付を入力してください'),
	endDate: yup.date().required('日付を入力してください'),
	isTimeExtended: yup.boolean(),
	deadline: yup.date().required('日付を入力してください'),
	isMentionChecked: yup.boolean(),
	mention: yup.array().when('isMentionChecked', {
		is: (isMentionChecked: boolean) => isMentionChecked,
		then: (schema) =>
			schema.required('日程調整に参加する部員を選択してください'),
		otherwise: (schema) => schema.notRequired(),
	}),
	title: yup.string().required('タイトルを入力してください'),
	description: yup.string(),
})

const ScheduleCreatePage = ({ session }: { session: Session }) => {
	const router = useRouter()
	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(ScheduleCreateSchema),
	})
	const startDate = watch('startDate')
	const watchMention = watch('mention')
	const watchAll = watch()
	const isMentionChecked = watch('isMentionChecked')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false)
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)
	const [error, setError] = useState<ErrorType>()

	const [scheduleId] = useState<string>(v4())

	const [users, setUsers] = useState<Record<string, string>>({})

	const onSubmit = async (data: any) => {
		setIsSubmitLoading(true)
		const allDates = eachDayOfInterval({
			start: data.startDate,
			end: data.endDate,
		})
		const dates = allDates.map((date) => DateToDayISOstring(date))

		const res = await createScheduleAction({
			id: scheduleId,
			userId: session.user.id,
			title: data.title,
			description: data.description,
			dates: dates,
			mention: data.mention,
			timeExtended: data.isTimeExtended,
			deadline: DateToDayISOstring(data.deadline),
		})
		if (res.status === 201) {
			setIsPopupOpen(true)
		} else {
			setError(res)
		}

		setIsSubmitLoading(false)
	}

	const getMentionUsers = async () => {
		setIsLoading(true)
		const res = await getUserIdWithNames()
		if (res.status === 200) {
			const userRecord = res.response.reduce(
				(acc, user) => {
					acc[user.id ?? ''] = user.name ?? ''
					return acc
				},
				{} as Record<string, string>,
			)
			setUsers(userRecord)
		}
		setIsLoading(false)
	}

	useEffect(() => {
		getMentionUsers()
	}, [])

	return (
		<div className="flex flex-col items-center justify-center py-6 bg-bg-white rounded-lg shadow-md">
			<h1 className="text-2xl font-bold">日程調整作成</h1>
			<form className="flex flex-col gap-y-2" onSubmit={handleSubmit(onSubmit)}>
				<TextInputField
					type="text"
					register={register('title')}
					label="イベント名"
					name="title"
					errorMessage={errors.title?.message}
				/>
				<TextareaInputField
					register={register('description')}
					label="イベント内容"
					name="description"
					errorMessage={errors.description?.message}
				/>
				<label className="cursor-pointer label gap-x-2 justify-start items-center">
					<input
						type="checkbox"
						{...register('isTimeExtended')}
						value="true"
						className="checkbox checkbox-primary"
					/>
					<span className="label-text text-base">細かい時間指定をオン</span>
				</label>
				<p className="text-sm">
					コマ表の時間を超えた予定調整が可能になります。
				</p>
				<label className="cursor-pointer label gap-x-2 justify-start items-center">
					<input
						type="checkbox"
						{...register('isMentionChecked')}
						value="true"
						className="checkbox checkbox-primary"
					/>
					<span className="label-text text-base">メンションをオン</span>
				</label>
				<p className="text-sm">特定の部員とだけの予定を作成できます。</p>
				{isMentionChecked &&
					(Object.keys(users).length === 0 && isLoading ? (
						<p>ユーザ情報を取得中...</p>
					) : (
						<SelectField
							name="mention"
							label="メンション"
							options={users}
							register={register('mention')}
							isMultiple={true}
							setValue={setValue}
							watchValue={watchMention}
							errorMessage={errors.mention?.message}
						/>
					))}
				<Controller
					name="startDate"
					control={control}
					render={({ field }) => (
						<CustomDatePicker
							label="開始日"
							selectedDate={field.value}
							onChange={field.onChange}
							minDate={new Date()}
							errorMessage={errors.startDate?.message}
						/>
					)}
				/>
				<Controller
					name="endDate"
					control={control}
					render={({ field }) => (
						<CustomDatePicker
							label="終了日"
							selectedDate={field.value ?? null}
							onChange={field.onChange}
							minDate={startDate}
							errorMessage={errors.endDate?.message}
						/>
					)}
				/>
				<Controller
					name="deadline"
					control={control}
					render={({ field }) => (
						<CustomDatePicker
							label="締め切り"
							selectedDate={field.value ?? null}
							onChange={field.onChange}
							minDate={new Date()}
							errorMessage={errors.deadline?.message}
						/>
					)}
				/>
				<button
					className="btn btn-primary btn-md mt-4"
					type="submit"
					disabled={isSubmitLoading}
				>
					作成
				</button>
				<button
					className="btn btn-outline btn-md"
					onClick={() => router.back()}
				>
					戻る
				</button>
				{error && (
					<p className="text-sm text-error text-center">
						エラーコード{error.status}:{error.response}
					</p>
				)}
			</form>
			<Popup
				ref={popupRef}
				title="日程調整作成完了"
				onClose={() => router.push('/schedule')}
				open={isPopupOpen}
			>
				<div>
					<p className="text-center">以下の内容で日程調整を作成しました。</p>
					<div className="my-4 px-4 space-y-2 text-left">
						<p>タイトル: {watchAll?.title}</p>
						<p>
							日程:
							{watchAll?.startDate
								? format(watchAll.startDate, 'yyyy/MM/dd(E)', { locale: ja })
								: '未入力'}{' '}
							-{' '}
							{watchAll?.endDate
								? format(watchAll.endDate, 'yyyy/MM/dd(E)', { locale: ja })
								: '未入力'}
						</p>
						<p>説明: {watchAll?.description || '未入力'}</p>
						<p>
							締め切り:
							{watchAll?.deadline
								? format(watchAll.deadline, 'yyyy/MM/dd(E)', { locale: ja })
								: '未入力'}
						</p>
						{watchAll?.isMentionChecked && (
							<p>
								メンション:{' '}
								{watchAll?.mention
									?.map((mention: string) => users[mention])
									.join(', ') || '未入力'}
							</p>
						)}
					</div>
					<div className="flex flex-row justify-center space-x-2">
						<ShareButton
							url={`${window.location.origin}/schedule/${scheduleId}`}
							title="日程調整を共有"
							text={`日程: ${format(
								watchAll.startDate || new Date(),
								'yyyy/MM/dd(E)',
								{
									locale: ja,
								},
							)} - ${format(watchAll.endDate || new Date(), 'yyyy/MM/dd(E)', {
								locale: ja,
							})}`}
							isFullButton
						/>
						<button
							className="btn btn-primary"
							onClick={() => router.push('/schedule')}
						>
							一覧に戻る
						</button>
					</div>
				</div>
			</Popup>
		</div>
	)
}

export default ScheduleCreatePage
