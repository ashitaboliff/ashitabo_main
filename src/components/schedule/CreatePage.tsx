'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Session } from 'next-auth'
import { DateToDayISOstring } from '@/lib/CommonFunction'
import { ErrorType } from '@/types/ResponseTypes'
import { UserWithName } from '@/types/ScheduleTypes'
import CustomDatePicker from '@/components/atoms/DatePicker'
import TextInputField from '@/components/atoms/TextInputField'
import SelectField from '@/components/atoms/SelectField'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import { getUserIdWithNames } from './actions'

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
	description: yup.string().required('説明を入力してください'),
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
	const isMentionChecked = watch('isMentionChecked')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false)
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)

	const [users, setUsers] = useState<Record<string, string>>({})

	const onSubmit = async (data: any) => {
		console.log(session)
		console.log(data)
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
			<h1 className="text-2xl font-bold">スケジュール作成</h1>
			<form className="flex flex-col gap-y-2" onSubmit={handleSubmit(onSubmit)}>
				<TextInputField
					type="text"
					register={register('title')}
					label="イベント名"
					name="title"
					errorMessage={errors.title?.message}
				/>
				<TextInputField
					type="text"
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
				<button className="btn btn-primary btn-md mt-4" type="submit">
					作成
				</button>
				<button
					className="btn btn-outline btn-md"
					onClick={() => router.back()}
				>
					戻る
				</button>
			</form>
		</div>
	)
}

export default ScheduleCreatePage
