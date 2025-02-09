'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSearchParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { v4 } from 'uuid'
import { DateToDayISOstring } from '@/lib/CommonFunction'
import { createBookingAction } from './actions'
import ShareButton from '@/components/atoms/ShareButton'
import TextInputField from '@/components/atoms/TextInputField'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import AddCalendarPopup from '@/components/molecules/AddCalendarPopup'
import PasswordInputField from '@/components/molecules/PasswordInputField'
import { Session } from 'next-auth'
import { ErrorType } from '@/types/ResponseTypes'
import { BookingTime } from '@/types/BookingTypes'

const today = new Date(
	new Date().getFullYear(),
	new Date().getMonth(),
	new Date().getDate(),
	0,
	0,
	0,
)

const schema = yup.object().shape({
	bookingDate: yup.string().required('日付を入力してください'),
	bookingTime: yup.string().required('時間を入力してください'),
	registName: yup.string().required('バンド名を入力してください'),
	name: yup.string().required('責任者名を入力してください'),
	password: yup.string().required('パスワードを入力してください'),
})

export default function NewBooking({ session }: { session: Session }) {
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

	const [bookingId] = useState<string>(v4())

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
			bookingTime: BookingTime[Number(bookingTime)],
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
		try {
			const response = await createBookingAction({
				bookingId: bookingId,
				userId: session.user.id,
				booking: reservationData,
				password: data.password,
				toDay: today.toISOString(),
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
		<div className="justify-center max-w-md mx-auto p-4 bg-bg-white shadow-md rounded-lg">
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
					<p>時間: {BookingTime[Number(bookingTime)]}</p>
					<p>バンド名: {watch('registName')}</p>
					<p>責任者: {watch('name')}</p>
					<div className="flex flex-col justify-center gap-y-2 mt-4">
						<div className="flex flex-row justify-center space-x-2">
							<button
								type="button"
								className="btn btn-primary"
								onClick={() => {
									setNoticePopupOpen(false)
									setAddCalendarPopupOpen(true)
								}}
							>
								スマホに予定追加
							</button>
							<ShareButton
								url={`${window.location.origin}/booking/${bookingId}`}
								title="予約をバンドに共有"
								text={`予約日: ${format(bookingDate, 'yyyy/MM/dd(E)', {
									locale: ja,
								})} ${BookingTime[Number(bookingTime)]}時`}
								isFullButton
							/>
						</div>
						<button
							type="button"
							className="btn btn-outline"
							onClick={() => router.push('/booking')}
						>
							ホームに戻る
						</button>
					</div>
				</div>
			</Popup>
			<AddCalendarPopup
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
