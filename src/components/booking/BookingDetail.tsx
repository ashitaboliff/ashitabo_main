'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { BookingDetailProps } from '@/types/BookingTypes'
import { PopupRef } from '@/components/molecules/Popup'
import AddCalendarPopup from '@/components/molecules/AddCalendarPopup'
import BookingDetailBox from '@/components/molecules/BookingDetailBox'
import BookingDetailNotFound from '@/components/booking/BookingDetailNotFound'

const BookingDetail = ({
	calendarTime,
	bookingDetail,
}: {
	calendarTime: string[]
	bookingDetail: BookingDetailProps
}) => {
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const calendarAddPopupRef = useRef<PopupRef>(undefined)
	const router = useRouter()

	if (!bookingDetail) {
		return <BookingDetailNotFound />
	}

	return (
		<div className="flex flex-col items-center justify-center">
			<BookingDetailBox
				props={{
					bookingDate: bookingDetail.bookingDate,
					bookingTime: bookingDetail.bookingTime,
					registName: bookingDetail.registName,
					name: bookingDetail.name,
					isPaidStatus: bookingDetail.isPaidStatus,
				}}
				calendarTime={calendarTime}
			/>
			<div className="flex flex-row justify-center space-x-2">
				<button
					className="btn btn-primary"
					onClick={() => router.push(`/booking/${bookingDetail?.id}/edit`)}
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
			<AddCalendarPopup
				calendarTime={calendarTime}
				bookingDetail={bookingDetail}
				isPopupOpen={isPopupOpen}
				setIsPopupOpen={setIsPopupOpen}
				calendarAddPopupRef={calendarAddPopupRef}
			/>
		</div>
	)
}

export default BookingDetail
