'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSearchParams, useRouter } from 'next/navigation'
import { format, addDays, subDays } from 'date-fns'
import { ja } from 'date-fns/locale'
import { DateToDayISOstring } from '@/lib/CommonFunction'
import { createBookingAction } from './actions'
import TextInputField from '@/components/atoms/TextInputField'
import InfoMessage from '@/components/atoms/InfoMessage'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import AddCalendarPopup from '@/components/molecules/AddCalendarPopup'
import { Session } from 'next-auth'
import PasswordInputField from '../molecules/PasswordInputField'
import { ErrorType } from '@/types/ResponseTypes'

const today = new Date(
	new Date().getFullYear(),
	new Date().getMonth(),
	new Date().getDate(),
	0,
	0,
	0,
)
const isPaidBookingDateMin = addDays(today, 14)

const schema = yup.object().shape({
	bookingDate: yup.string().required('日付を入力してください'),
	bookingTime: yup.string().required('時間を入力してください'),
	registName: yup.string().required('バンド名を入力してください'),
	name: yup.string().required('責任者名を入力してください'),
	password: yup.string().required('パスワードを入力してください'),
})

export default function NewBooking({
	calendarTime,
	session,
}: {
	calendarTime: string[]
	session: Session
}) {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [noticePopupOpen, setNoticePopupOpen] = useState(false)
	const [addCalendarPopupOpen, setAddCalendarPopupOpen] = useState(false)
	const [error, setError] = useState<ErrorType>()
	const noticePopupRef = useRef<PopupRef>()
	const addCalendarPopupRef = useRef<PopupRef>()
	const [showPassword, setShowPassword] = useState(false)

	const queryParams = useSearchParams()
	const bookingDateParam = queryParams.get('date')
	const bookingTimeParam = queryParams.get('time')

	const bookingDate = bookingDateParam ? new Date(bookingDateParam) : new Date()
	const bookingTime = bookingTimeParam || '0'
	const isPaid = bookingDate >= isPaidBookingDateMin

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		mode: 'onBlur',
		resolver: yupResolver(schema),
		defaultValues: {
			bookingDate: bookingDate.toISOString().split('T')[0],
			bookingTime: calendarTime[Number(bookingTime)],
		},
	})

	const onSubmit = async (data: any) => {
		setNoticePopupOpen(false)
		setAddCalendarPopupOpen(false)
		setLoading(true)
		const reservationData = {
			bookingDate: DateToDayISOstring(bookingDate),
			bookingTime: Number(bookingTime),
			registName: data.registName,
			name: data.name,
			isDeleted: false,
		}
		let isPaidExpired
		if (isPaid) {
			isPaidExpired = DateToDayISOstring(subDays(bookingDate, 7))
		}
		try {
			const response = await createBookingAction({
				userId: session.user.id,
				booking: reservationData,
				isPaid,
				isPaidExpired,
				password: data.password,
				toDay: today.toISOString(),
				isPaidBookingDateMin: isPaidBookingDateMin.toISOString(),
			})
			if (response.status === 201) {
				setNoticePopupOpen(true)
			} else {
				setError({ status: response.status, response: response.response })
			}
		} catch (e) {
			setError({
				status: 500,
				response:
					'このエラーが出た際はわたべに問い合わせてください。' + String(e),
			})
		}
		setLoading(false)
	}

	return (
		<div className="p-8">
			<h2 className="text-2xl font-bold text-center mb-8">新規予約</h2>
			<div className="max-w-md mx-auto">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
					<TextInputField
						label="日付"
						register={register('bookingDate')}
						type="date"
						disabled
					/>
					<TextInputField
						label="時間"
						register={register('bookingTime')}
						type="text"
						disabled
					/>
					<TextInputField
						type="text"
						label="バンド名"
						register={register('registName')}
						placeholder="バンド名"
						errorMessage={errors.registName?.message}
					/>
					<TextInputField
						type="text"
						label="責任者"
						register={register('name')}
						placeholder="責任者名"
						errorMessage={errors.name?.message}
					/>
					<PasswordInputField
						label="パスワード"
						register={register('password')}
						showPassword={showPassword}
						handleClickShowPassword={() => setShowPassword(!showPassword)}
						handleMouseDownPassword={(e) => e.preventDefault()}
						errorMessage={errors.password?.message}
					/>
					{isPaid && (
						<div className="flex justify-center">
							<InfoMessage
								messageType="warning"
								IconColor="bg-white"
								message={
									<>
										このコマを予約するには600円の支払いが必要です。
										<br />
										支払いは現金およびPayPayでお願いします。
									</>
								}
							/>
						</div>
					)}
					<div className="flex justify-center space-x-4">
						<button
							type="submit"
							className="btn btn-primary"
							disabled={loading}
						>
							{loading ? '処理中...' : '予約する'}
						</button>
						<button
							type="button"
							className="btn btn-outline"
							onClick={() => router.push('/booking')}
						>
							カレンダーに戻る
						</button>
					</div>
					{error && (
						<p className="text-sm text-error text-center">
							エラーコード{error.status}:{error.response}
						</p>
					)}
				</form>
			</div>
			<Popup
				ref={noticePopupRef}
				title="予約完了"
				open={noticePopupOpen}
				onClose={() => setNoticePopupOpen(false)}
			>
				<div className="text-center">
					<p>以下の内容で予約が完了しました。</p>
					<p>日付: {format(bookingDate, 'yyyy/MM/dd(E)', { locale: ja })}</p>
					<p>時間: {calendarTime[Number(bookingTime)]}</p>
					<p>バンド名: {watch('registName')}</p>
					<p>責任者: {watch('name')}</p>
					{isPaid && (
						<>
							<p>支払い: 600円</p>
							<p>
								支払い期限:{' '}
								{format(subDays(bookingDate, 7), 'yyyy/MM/dd(E)', {
									locale: ja,
								})}
							</p>
						</>
					)}
					<div className="flex flex-row justify-center gap-x-1">
						<button
							type="button"
							className="btn btn-primary mt-4"
							onClick={() => {
								setNoticePopupOpen(false)
								setAddCalendarPopupOpen(true)
							}}
						>
							カレンダーに追加する
						</button>
						<button
							type="button"
							className="btn btn-outline mt-4"
							onClick={() => router.push('/booking')}
						>
							ホームに戻る
						</button>
					</div>
				</div>
			</Popup>
			<AddCalendarPopup
				calendarTime={calendarTime}
				bookingDetail={{
					id: '',
					userId: '',
					createdAt: new Date(),
					updatedAt: new Date(),
					bookingDate: DateToDayISOstring(bookingDate),
					bookingTime: Number(bookingTime),
					registName: watch('registName'),
					name: watch('name'),
					isDeleted: false,
				}}
				isPopupOpen={addCalendarPopupOpen}
				setIsPopupOpen={setAddCalendarPopupOpen}
				calendarAddPopupRef={addCalendarPopupRef}
			/>
		</div>
	)
}
