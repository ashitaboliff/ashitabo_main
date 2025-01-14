'use client'

import { useState, useEffect, useRef, memo, use } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { addDays, sub, subDays } from 'date-fns'
import {
	getBookingByDateAction,
	updateBookingAction,
	deleteBookingAction,
	bookingRevalidateTagAction,
} from './actions'
import {
	Booking,
	BookingDetailProps,
	BookingResponse,
	BuyBookingStatus,
} from '@/types/BookingTypes'
import { Session } from 'next-auth'
import Loading from '@/components/atoms/Loading'
import TextInputField from '@/components/atoms/TextInputField'
import InfoMessage from '@/components/atoms/InfoMessage'
import BookingDetailBox from '@/components/molecules/BookingDetailBox'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import BookingDetailNotFound from '@/components/booking/BookingDetailNotFound'
import EditCalendar from '@/components/booking/EditCalendar'
import { DateToDayISOstring } from '@/lib/CommonFunction'
import { MdOutlineEditCalendar } from 'react-icons/md'

const schema = yup.object().shape({
	bookingDate: yup.string().required('予約日を入力してください'),
	bookingTime: yup.string().required('予約時間を入力してください'),
	registName: yup.string().required('バンド名を入力してください'),
	name: yup.string().required('責任者名を入力してください'),
})

type ResultType = {
	status: 'success' | 'error'
	title: string
	message: string
}

const BookingEditForm = ({
	calendarTime,
	bookingDetail,
	session,
}: {
	calendarTime: string[]
	bookingDetail: BookingDetailProps
	session: Session
}) => {
	const router = useRouter()
	const [editState, setEditState] = useState<'edit' | 'delete' | 'select'>(
		'select',
	)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [editPopupOpen, setEditPopupOpen] = useState(false)
	const [deletePopupOpen, setDeletePopupOpen] = useState(false)
	const [resultPopupOpen, setResultPopupOpen] = useState(false)
	const [result, setResult] = useState<ResultType>()
	const editPopupRef = useRef<PopupRef>(undefined)
	const deletePopupRef = useRef<PopupRef>(undefined)
	const resultPopupRef = useRef<PopupRef>(undefined)

	const onDeleteSubmit = async () => {
		setIsLoading(true)
		setDeletePopupOpen(false)
		setEditPopupOpen(false)
		try {
			const response = await deleteBookingAction({
				bookingId: bookingDetail.id,
				userId: session.user.id,
			})
			if (response.status === 200) {
				setResult({
					status: 'success',
					title: '予約削除',
					message: '予約の削除に成功しました',
				})
			} else {
				setResult({
					status: 'error',
					title: '予約削除',
					message: '予約の削除に失敗しました',
				})
			}
		} catch (error) {
			setResult({
				status: 'error',
				title: '予約削除',
				message: '予約の削除に失敗しました。エラーコード:' + error,
			})
		}
		setResultPopupOpen(true)
		setIsLoading(false)
	}

	if (!bookingDetail) {
		return <BookingDetailNotFound />
	}

	return (
		<>
			{editState === 'select' && (
				<div className="flex flex-col items-center justify-center p-4">
					<BookingDetailBox
						props={{
							bookingDate: bookingDetail.bookingDate,
							bookingTime: bookingDetail.bookingTime,
							registName: bookingDetail.registName,
							name: bookingDetail.name,
						}}
						calendarTime={calendarTime}
					/>
					<div className="flex justify-center gap-4 mt-4">
						<button
							className="btn btn-primary"
							onClick={() => setEditState('edit')}
						>
							編集
						</button>
						<button
							className="btn btn-secondary"
							onClick={() => {
								setEditState('delete')
								setDeletePopupOpen(true)
							}}
						>
							削除
						</button>
						<button
							className="btn btn-outline"
							onClick={() => router.push('/booking')}
						>
							ホームに戻る
						</button>
					</div>
				</div>
			)}
			{editState === 'edit' && (
				<MemoBookingEditForm
					calendarTime={calendarTime}
					bookingDetail={bookingDetail}
					session={session}
					setEditState={setEditState}
				/>
			)}

			<Popup
				ref={deletePopupRef}
				title="予約削除"
				maxWidth="sm"
				open={deletePopupOpen}
				onClose={() => setDeletePopupOpen(false)}
			>
				<div className="p-4">
					<p className="text-center">予約を削除しますか？</p>
					<div className="flex justify-center gap-4 mt-4">
						<button className="btn btn-error" onClick={onDeleteSubmit}>
							削除
						</button>
						<button
							className="btn btn-outline"
							onClick={() => setDeletePopupOpen(false)}
						>
							キャンセル
						</button>
					</div>
				</div>
			</Popup>

			<Popup
				ref={resultPopupRef}
				title={result?.title as string}
				maxWidth="sm"
				open={resultPopupOpen}
				onClose={() => setResultPopupOpen(false)}
			>
				<div className="p-4 text-center">
					<InfoMessage
						message={result?.message as string}
						messageType={result?.status === 'success' ? 'success' : 'error'}
						IconColor="bg-white"
					/>
					<div className="flex justify-center gap-4 mt-4">
						<button
							className="btn btn-outline"
							onClick={() => {
								router.push('/booking')
								setResultPopupOpen(false)
							}}
						>
							ホームに戻る
						</button>
					</div>
				</div>
			</Popup>
		</>
	)
}

const MemoBookingEditForm = memo(
	({
		calendarTime,
		bookingDetail,
		session,
		setEditState,
	}: {
		calendarTime: string[]
		bookingDetail: BookingDetailProps
		session: Session
		setEditState: (state: 'edit' | 'delete' | 'select') => void
	}) => {
		const router = useRouter()
		const [isPaid, setIsPaid] = useState<boolean>(
			bookingDetail.isPaidStatus ? true : false,
		)
		const [bookingDate, setBookingDate] = useState<string>(
			new Date(bookingDetail.bookingDate).toISOString().split('T')[0],
		)
		const [bookingTime, setBookingTime] = useState<number>(
			bookingDetail.bookingTime,
		)
		const [calendarOpen, setCalendarOpen] = useState<boolean>(false)
		const calendarRef = useRef<PopupRef>(undefined)
		const [resultPopupOpen, setResultPopupOpen] = useState(false)
		const [result, setResult] = useState<ResultType>()
		const resultPopupRef = useRef<PopupRef>(undefined)

		const yesterDate = subDays(new Date(), 1)
		const [viewDay, setViewday] = useState<Date>(yesterDate)
		const [viewDayMax, setViewDayMax] = useState<number>(7) // いずれなんとかするかこれ
		const ableViewDayMax = 27 // 連続表示可能な日数
		const ableViewDayMin = 1 // 連続表示可能な最小日数
		const [bookingResponse, setBookingResponse] = useState<BookingResponse>()

		let nextAble =
			addDays(viewDay, viewDayMax) <= addDays(yesterDate, ableViewDayMax)
				? false
				: true
		let prevAble =
			subDays(viewDay, viewDayMax) >= subDays(yesterDate, ableViewDayMin)
				? false
				: true

		const nextWeek = () => {
			setViewday(addDays(viewDay, viewDayMax))
		}

		const prevWeek = () => {
			setViewday(subDays(viewDay, viewDayMax))
		}

		const {
			register,
			handleSubmit,
			formState: { errors },
			setValue,
		} = useForm({
			mode: 'onBlur',
			resolver: yupResolver(schema),
			defaultValues: {
				bookingDate: bookingDate,
				bookingTime: calendarTime[bookingTime],
				registName: bookingDetail.registName,
				name: bookingDetail.name,
			},
		})

		const onPutSubmit = async (data: any) => {
			setResultPopupOpen(false)
			let buyStatus: BuyBookingStatus | undefined = undefined
			let isBuyUpdate = false
			let isPaidExpired: string | undefined = undefined

			if (bookingDetail.isPaidStatus && !isPaid) {
				// 現在の予約が購入予約で予約を変更する場合
				buyStatus = 'CANCELED'
				isBuyUpdate = true
			} else if (bookingDetail.isPaidStatus === undefined && isPaid) {
				// 現在の予約が未購入予約で予約を変更する場合
				buyStatus = 'UNPAID'
				isBuyUpdate = true
				isPaidExpired = DateToDayISOstring(subDays(new Date(bookingDate), 7))
			}

			console.log('ActionArgs:', {
				bookingId: bookingDetail.id,
				userId: session.user.id,
				booking: {
					bookingDate: DateToDayISOstring(new Date(data.bookingDate)),
					bookingTime: bookingTime,
					registName: data.registName,
					name: data.name,
					isDeleted: false,
				},
				isBuyUpdate: isBuyUpdate,
				state: buyStatus,
				expiredAt: isPaidExpired,
			})

			const response = await updateBookingAction({
				bookingId: bookingDetail.id,
				userId: session.user.id,
				booking: {
					bookingDate: DateToDayISOstring(new Date(data.bookingDate)),
					bookingTime: bookingTime,
					registName: data.registName,
					name: data.name,
					isDeleted: false,
				},
				isBuyUpdate: isBuyUpdate,
				state: buyStatus,
				expiredAt: isPaidExpired,
			})

			if (response.status === 200) {
				setResult({
					status: 'success',
					title: '予約編集',
					message: '予約の編集に成功しました',
				})
			} else if (response.status === 404) {
				setResult({
					status: 'error',
					title: '予約編集',
					message: '予約の編集に失敗しました。予約が見つかりませんでした',
				})
			} else {
				setResult({
					status: 'error',
					title: '予約編集',
					message:
						'予約の編集に失敗しました。何度もこのエラーが出る際は管理者にお問い合わせください',
				})
			}
			setResultPopupOpen(true)
		}

		const getBooking = async ({
			startDate, // Date
			endDate, // Date
			cache,
		}: {
			startDate: Date
			endDate: Date
			cache?: 'no-cache'
		}) => {
			if (cache === 'no-cache') {
				await bookingRevalidateTagAction({ tag: 'booking' })
			}
			const startDay = DateToDayISOstring(startDate).split('T')[0]
			const endDay = DateToDayISOstring(endDate).split('T')[0]
			const res = await getBookingByDateAction({
				startDate: startDay,
				endDate: endDay,
			})
			if (res.status === 200) {
				setBookingResponse({ ...res.response })
			} else {
				console.error('Failed to get booking data')
				return null
			}
		}

		useEffect(() => {
			getBooking({
				startDate: viewDay,
				endDate: addDays(viewDay, viewDayMax - 1),
			})
		}, [viewDay])

		useEffect(() => {
			setValue('bookingDate', bookingDate)
			setValue('bookingTime', calendarTime[bookingTime])
		}, [bookingDate, bookingTime])

		return (
			<div className="p-8">
				<div className="text-center mb-8">
					<h2 className="text-2xl font-bold">予約編集</h2>
				</div>

				<div className="max-w-md mx-auto">
					<form onSubmit={handleSubmit(onPutSubmit)} className="space-y-2">
						<div className="flex flex-row justify-center gap-2">
							<div className="flex flex-col space-y-2">
								<TextInputField
									register={register('bookingDate')}
									placeholder="日付"
									type="text"
									disabled={true}
								/>
								<TextInputField
									register={register('bookingTime')}
									placeholder="時間"
									type="text"
									disabled={true}
								/>
							</div>
							<div className="flex flex-col items-center justify-center">
								<button
									type="button"
									className="btn btn-primary"
									onClick={() => setCalendarOpen(true)}
								>
									<MdOutlineEditCalendar size={25} />
								</button>
							</div>
						</div>
						<TextInputField
							register={register('registName')}
							placeholder="バンド名"
							type="text"
						/>
						{errors.registName && (
							<div className="flex justify-center">
								<InfoMessage
									messageType="error"
									IconColor="bg-white"
									message={errors.registName.message}
								/>
							</div>
						)}
						<TextInputField
							register={register('name')}
							placeholder="責任者名"
							type="text"
						/>
						{errors.name && (
							<div className="flex justify-center">
								<InfoMessage
									messageType="error"
									IconColor="bg-white"
									message={errors.name.message}
								/>
							</div>
						)}
						{isPaid && bookingDetail.isPaidStatus !== 'PAID' && (
							<div className="flex justify-center">
								<InfoMessage
									messageType="warning"
									IconColor="bg-white"
									message="このコマを予約するには600円の支払いが必要です。"
								/>
							</div>
						)}
						{!isPaid && bookingDetail.isPaidStatus === 'PAID' && (
							<div className="flex justify-center">
								<InfoMessage
									messageType="warning"
									IconColor="bg-white"
									message="支払い済みの有料枠から無料枠への変更です。支払われた金額は返金されます。"
								/>
							</div>
						)}

						<div className="flex justify-center space-x-4">
							<button type="submit" className="btn btn-primary">
								予約を編集する
							</button>
							<button
								type="button"
								className="btn btn-outline"
								onClick={() => setEditState('select')}
							>
								戻る
							</button>
						</div>
					</form>
				</div>

				<Popup
					ref={calendarRef}
					title="カレンダー"
					maxWidth="lg"
					open={calendarOpen}
					onClose={() => setCalendarOpen(false)}
				>
					<div className="flex flex-col gap-y-2 items-center justify-center">
						<div className="flex flex-row justify-center space-x-2">
							<button
								className="btn btn-outline"
								onClick={prevWeek}
								disabled={prevAble}
							>
								{'<'}
							</button>
							<div className="text-lg font-bold mx-2 w-60 text-center">
								{viewDay.toLocaleDateString()}~
								{addDays(viewDay, viewDayMax - 1).toLocaleDateString()}
							</div>
							<button
								className="btn btn-outline"
								onClick={nextWeek}
								disabled={nextAble}
							>
								{'>'}
							</button>
						</div>
						{bookingResponse ? (
							<EditCalendar
								bookingResponse={bookingResponse}
								timeList={calendarTime}
								actualBookingDate={
									new Date(bookingDetail.bookingDate)
										.toISOString()
										.split('T')[0]
								}
								actualBookingTime={bookingDetail.bookingTime}
								bookingDate={bookingDate}
								setBookingDate={setBookingDate}
								bookingTime={bookingTime}
								setBookingTime={setBookingTime}
								setIsPaid={setIsPaid}
								setCalendarOpen={setCalendarOpen}
							/>
						) : (
							<div className="flex justify-center">
								<div className="skeleton h-96 w-96"></div>
							</div>
						)}
						<div className="flex justify-center space-x-2">
							<button
								type="button"
								className="btn btn-outline"
								onClick={() => setCalendarOpen(false)}
							>
								閉じる
							</button>
						</div>
					</div>
				</Popup>

				<Popup
					ref={resultPopupRef}
					title={result?.title as string}
					maxWidth="sm"
					open={resultPopupOpen}
					onClose={() => setResultPopupOpen(false)}
				>
					<div className="p-4 text-center">
						<InfoMessage
							message={result?.message as string}
							messageType={result?.status === 'success' ? 'success' : 'error'}
							IconColor="bg-white"
						/>
						<div className="flex justify-center gap-4 mt-4">
							<button
								className="btn btn-outline"
								onClick={() => {
									setResultPopupOpen(false)
								}}
							>
								閉じる
							</button>
							<button
								className="btn btn-outline"
								onClick={() => {
									router.push('/booking')
									setResultPopupOpen(false)
								}}
							>
								ホームに戻る
							</button>
						</div>
					</div>
				</Popup>
			</div>
		)
	},
)

export default BookingEditForm
