'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { format, eachDayOfInterval, getDay, set } from 'date-fns'
import { ja } from 'date-fns/locale'
import { BookingTime } from '@/features/booking/types'
import { DateToDayISOstring } from '@/utils'
import { createBookingBanDateAction } from './action'
import { ErrorType } from '@/utils/types/responseTypes'
import CustomDatePicker from '@/components/ui/atoms/DatePicker'
import TextInputField from '@/components/ui/atoms/TextInputField'
import SelectField from '@/components/ui/atoms/SelectField'
import Popup, { PopupRef } from '@/components/ui/molecules/Popup'

type BanTypeValue = 'single' | 'period' | 'regular'

type BanTypeLabel = '単発禁止' | '期間禁止' | '定期禁止'

const BanType: { value: BanTypeValue; label: BanTypeLabel }[] = [
	{ value: 'single', label: '単発禁止' },
	{ value: 'period', label: '期間禁止' },
	{ value: 'regular', label: '定期禁止' },
]

const dayOfWeek = [
	{ value: '0', label: '日' },
	{ value: '1', label: '月' },
	{ value: '2', label: '火' },
	{ value: '3', label: '水' },
	{ value: '4', label: '木' },
	{ value: '5', label: '金' },
	{ value: '6', label: '土' },
]

const BanBookingSchema = yup.object().shape({
	type: yup
		.mixed()
		.oneOf(BanType.map((type) => type.value))
		.required('禁止タイプを選択してください'),
	startDate: yup.date().required('日付を入力してください'),
	endDate: yup.date().when('type', {
		is: (type: BanTypeValue) => type === 'regular',
		then: (schema) => schema.required('日付を入力してください'),
		otherwise: (schema) => schema.notRequired(),
	}),
	startTime: yup.string().required('開始時間を入力してください'),
	endTime: yup.string().when('type', {
		is: (type: BanTypeValue) => type !== 'single',
		then: (schema) => schema.required('終了時間を入力してください'),
		otherwise: (schema) => schema.notRequired(),
	}),
	dayOfWeek: yup.mixed().when('type', {
		is: (type: BanTypeValue) => type === 'regular',
		then: (schema) =>
			schema
				.oneOf(dayOfWeek.map((day) => day.value))
				.required('曜日を選択してください'),
		otherwise: (schema) => schema.notRequired(),
	}),
	description: yup.string().required('説明を入力してください'),
})

const BanBookingCreate = () => {
	const router = useRouter()
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)
	const [error, setError] = useState<ErrorType>()

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
		watch,
	} = useForm({
		mode: 'onBlur',
		resolver: yupResolver(BanBookingSchema),
		defaultValues: {
			type: 'single',
		},
	})

	const type = watch('type')

	const onSubmit = async (data: any) => {
		if (data.type === 'single') {
			const res = await createBookingBanDateAction({
				startDate: DateToDayISOstring(data.startDate),
				startTime: Number(data.startTime),
				description: data.description,
			})
			if (res.status === 201) {
				reset()
				setIsPopupOpen(true)
			} else {
				setError(res)
			}
		} else if (data.type === 'period') {
			const res = await createBookingBanDateAction({
				startDate: DateToDayISOstring(data.startDate),
				startTime: Number(data.startTime),
				endTime: Number(data.endTime),
				description: data.description,
			})
			if (res.status === 201) {
				reset()
				setIsPopupOpen(true)
			} else {
				setError(res)
			}
		} else if (data.type === 'regular') {
			const allDates = eachDayOfInterval({
				start: data.startDate,
				end: data.endDate,
			})
			const dates = allDates
				.filter((date) => getDay(date) === Number(data.dayOfWeek))
				.map((date) => DateToDayISOstring(date))
			const res = await createBookingBanDateAction({
				startDate: dates,
				startTime: Number(data.startTime),
				endTime: Number(data.endTime),
				description: data.description,
			})
			if (res.status === 201) {
				reset()
				setIsPopupOpen(true)
			} else {
				setError(res)
			}
		}
	}

	return (
		<div className="flex flex-col items-center justify-center gap-y-2">
			<h1 className="text-2xl font-bold">予約禁止日追加</h1>
			<p className="text-sm text-center">
				このページでは予約禁止日の追加が可能です。
			</p>
			<form
				className="flex flex-col space-y-4 w-full max-w-xs items-center px-8"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex flex-row items-center space-x-2">
					{BanType.map((type) => (
						<div
							key={type.value}
							className="flex flex-row items-center space-x-2"
						>
							<input
								type="radio"
								id={type.value}
								{...register('type')}
								value={type.value}
								className="radio radio-primary"
							/>
							<label htmlFor={type.value}>{type.label}</label>
						</div>
					))}
				</div>
				{type === 'period' && (
					<p className="text-xs">
						期間禁止:ある日のある時間からある時間までの予約を禁止したいときに利用します。
					</p>
				)}
				{type === 'regular' && (
					<p className="text-xs">
						定期禁止:ある日付からある日付までの特定の曜日に対して、この時間からこの時間までは利用できない場合に利用します。
					</p>
				)}
				{type === 'single' && (
					<p className="text-xs">
						単発禁止:この日のこの時間のみを禁止したいときに利用します。
					</p>
				)}
				<Controller
					name="startDate"
					control={control}
					render={({ field }) => (
						<CustomDatePicker
							label="開始日"
							selectedDate={field.value}
							onChange={field.onChange}
						/>
					)}
				/>
				{type === 'regular' && (
					<Controller
						name="endDate"
						control={control}
						render={({ field }) => (
							<CustomDatePicker
								label="終了日"
								selectedDate={field.value ?? null}
								onChange={field.onChange}
							/>
						)}
					/>
				)}
				<SelectField
					label="開始時間"
					name="startTime"
					register={register('startTime')}
					options={BookingTime.reduce(
						(acc, cur, i) => {
							acc[i.toString()] = cur
							return acc
						},
						{} as Record<string, string>,
					)}
					errorMessage={errors.startTime?.message}
				/>
				{type !== 'single' && (
					<SelectField
						label="終了時間"
						name="endTime"
						register={register('endTime')}
						options={BookingTime.reduce(
							(acc, cur, i) => {
								acc[i.toString()] = cur
								return acc
							},
							{} as Record<string, string>,
						)}
						errorMessage={errors.endTime?.message}
					/>
				)}
				{type === 'regular' && (
					<div>
						<label className="label">繰り返し</label>
						<div className="flex flex-row items-center space-x-2">
							<div className="whitespace-nowrap text-sm">毎週</div>
							<SelectField
								name="dayOfWeek"
								register={register('dayOfWeek')}
								options={dayOfWeek.reduce(
									(acc, cur) => {
										acc[cur.value] = cur.label
										return acc
									},
									{} as Record<string, string>,
								)}
								errorMessage={errors.dayOfWeek?.message}
							/>
							<div className="whitespace-nowrap text-sm">曜日</div>
						</div>
					</div>
				)}
				<TextInputField
					type="text"
					register={register('description')}
					label="説明"
					errorMessage={errors.description?.message}
				/>
				<div className="flex flex-row gap-x-2">
					<button className="btn btn-primary btn-md" type="submit">
						送信
					</button>
					<button
						className="btn btn-outline btn-md"
						type="button"
						onClick={() => router.push('/admin/forbidden')}
					>
						戻る
					</button>
				</div>
			</form>
			{error && (
				<p className="text-sm text-error text-center">
					エラーコード{error.status}:{error.response}
				</p>
			)}
			<Popup
				ref={popupRef}
				title="予約禁止日追加"
				open={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
			>
				<div className="p-4 flex flex-col justify-center gap-2">
					<p className="font-bold text-primary text-center">
						予約禁止日を追加しました
					</p>
					<button
						className="btn btn-outline"
						onClick={() => router.push('/admin/forbidden')}
					>
						予約禁止日一覧に戻る
					</button>
				</div>
			</Popup>
		</div>
	)
}

export default BanBookingCreate
