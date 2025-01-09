'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Booking } from '@/types/BookingTypes'
import { format, set } from 'date-fns'
import { getBookingByIdAction, bookingRevalidateTagAction } from './actions'
import Loading from '@/components/atoms/Loading'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import BookingDetailBox from '@/components/molecules/BookingDetailBox'
import BookingDetailNotFound from '@/components/booking/BookingDetailNotFound'

import { FaApple, FaYahoo } from 'react-icons/fa'
import { SiGooglecalendar } from 'react-icons/si'

const BookingDetail = ({ calendarTime }: { calendarTime: string[] }) => {
	const id = useSearchParams().get('id')
	if (!id) {
		return <BookingDetailNotFound />
	}
	const [bookingDetail, setBookingDetail] = useState<Booking | undefined>(
		undefined,
	)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	let bookingDate: Date[] = []
	const calendarAddPopupRef = useRef<PopupRef>(undefined)
	const router = useRouter()

	const fetchBookingDetail = async ({
		id,
		cache,
	}: {
		id: string
		cache?: 'no-cache'
	}) => {
		if (cache === 'no-cache') {
			setIsLoading(true)
			await bookingRevalidateTagAction({ tag: `booking-${id}` })
		}
		const res = await getBookingByIdAction(id)
		if (res.status === 200) {
			setBookingDetail(res.response)
		} else if (res.status === 404) {
			setBookingDetail(undefined)
		} else {
			console.error(res)
			setBookingDetail(undefined)
		}
		setIsLoading(false)
	}

	useEffect(() => {
		fetchBookingDetail({ id, cache: 'no-cache' })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id])

	useEffect(() => {
		if (bookingDetail) {
			bookingDate = calendarTime[bookingDetail.bookingTime]
				.split('~')
				.map(
					(time) =>
						new Date(
							new Date(bookingDetail.bookingDate).setHours(
								...(time.split(':').map(Number) as [
									number,
									number,
									number,
									number,
								]),
							),
						),
				) // chat GPTに作らせたコードだけど難しいことしてないな、頑張って読んで
		}
	}, [bookingDetail, bookingDate])

	if (isLoading) {
		return <Loading />
	}

	if (!bookingDetail) {
		return <BookingDetailNotFound />
	}

	return (
		<div className="flex flex-col items-center justify-center">
			<BookingDetailBox
				props={{
					booking_date: bookingDetail.bookingDate,
					booking_time: bookingDetail.bookingTime,
					regist_name: bookingDetail.registName,
					name: bookingDetail.name,
				}}
				calendarTime={calendarTime}
			/>
			<div className="flex flex-row justify-center space-x-2">
				<button
					className="btn btn-primary"
					onClick={() => router.push(`/booking/edit?id=${bookingDetail?.id}`)}
				>
					編集
				</button>
				<button
					className="btn btn-tertiary"
					onClick={() => setIsPopupOpen(true)}
				>
					カレンダーに追加する
				</button>
				<button
					className="btn btn-outline"
					onClick={() => router.push('/booking')}
				>
					ホームに戻る
				</button>
			</div>
			<Popup
				ref={calendarAddPopupRef}
				open={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
				title="カレンダーに追加"
				maxWidth="sm"
			>
				<div className="text-center">
					<div>
						<p>予定を追加するカレンダーアプリを選択してください。</p>
						<a href={'/booking/detail/calendar'} className="underline">
							以下にないアプリを利用の場合はこちら
						</a>
						<div className="flex justify-center gap-1">
							<button
								className="btn btn-outline btn-sm"
								onClick={() =>
									open(
										`https://www.google.com/calendar/render?
										action=TEMPLATE&
										text=${encodeURIComponent(bookingDetail.registName)}&
										dates=${encodeURIComponent(format(bookingDate[0], "yyyyMMdd'T'HHmmss"))}/${encodeURIComponent(format(bookingDate[1], "yyyyMMdd'T'HHmmss"))}&
										details=${encodeURIComponent(bookingDetail.name)}による音楽室でのコマ予約&
										location=あしたぼ`,
									)
								}
							>
								<SiGooglecalendar color="#2180FC" />
								Google
							</button>
							{/* <button
								className="btn btn-outline btn-sm"
								onClick={() =>
									open(
										`https://outlook.office.com/calendar/action/compose&
										subject=${encodeURIComponent(bookingDetail.regist_name)}&
										startdt=${encodeURIComponent(format(bookingDate[0], "yyyy-MM-dd'T'HH:mm:ss"))}&
										enddt=${encodeURIComponent(format(bookingDate[1], "yyyy-MM-dd'T'HH:mm:ss"))}&
										body=${encodeURIComponent(bookingDetail.name)}による音楽室でのコマ予約&
										location=あしたぼ`,
									)
								}
							>
								<PiMicrosoftOutlookLogo color="#0072C6" />
								Outlook なんか無理なのであきらめ
							</button> */}
							<button
								className="btn btn-outline btn-sm"
								onClick={() =>
									open(
										`https://calendar.yahoo.co.jp/?v=60&
										title=${encodeURIComponent(bookingDetail.registName)}&
										st=${encodeURIComponent(format(bookingDate[0], "yyyyMMdd'T'HHmmss"))}&
										et=${encodeURIComponent(format(bookingDate[1], "yyyyMMdd'T'HHmmss"))}&
										desc=${encodeURIComponent(bookingDetail.name)}による音楽室でのコマ予約&
										in_loc=あしたぼ`,
									)
								}
							>
								<FaYahoo color="#720E9E" />
								Yahoo!
							</button>
							<button
								className="btn btn-outline btn-sm btn-active btn-link"
								onClick={() =>
									(window.location.href = `/api/generate-ics?
										start=${encodeURIComponent(format(bookingDate[0], "yyyyMMdd'T'HHmmss"))}&
										end=${encodeURIComponent(format(bookingDate[1], "yyyyMMdd'T'HHmmss"))}&
										summary=${encodeURIComponent(bookingDetail.registName)}&
										description=${encodeURIComponent(bookingDetail.name)}&
										openExternalBrowser=1`)
								}
							>
								<FaApple color="#000" />
								Apple
							</button>
						</div>
					</div>
					<div className="mt-4">
						<button
							className="btn btn-outline"
							onClick={() => setIsPopupOpen(false)}
						>
							閉じる
						</button>
					</div>
				</div>
			</Popup>
		</div>
	)
}

export default BookingDetail
