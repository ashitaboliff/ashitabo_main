'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { usePathname } from 'next/navigation'
import { BookingDetailProps } from '@/types/BookingTypes'
import ShareButton from '@/components/atoms/ShareButton'
import { PopupRef } from '@/components/molecules/Popup'
import AddCalendarPopup from '@/components/molecules/AddCalendarPopup'
import BookingDetailBox from '@/components/molecules/BookingDetailBox'
import BookingDetailNotFound from '@/components/booking/BookingDetailNotFound'

const BookingDetail = ({
	bookingDetail,
}: {
	bookingDetail: BookingDetailProps
}) => {
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const calendarAddPopupRef = useRef<PopupRef>(undefined)
	const router = useRouter()
	const pathname = usePathname()

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
			/>
			<div className="flex flex-col justify-center space-y-2">
				<div className="flex flex-row justify-center space-x-2">
					<button
						className="btn btn-primary w-32"
						onClick={() => router.push(`/booking/${bookingDetail?.id}/edit`)}
					>
						編集
					</button>
					<button
						className="btn btn-tetiary btn-outline w-32"
						onClick={() => setIsPopupOpen(true)}
					>
						スマホに追加
					</button>
					<ShareButton
						url={pathname}
						title="予約を共有"
						text={`予約日: ${bookingDetail.bookingDate} ${bookingDetail.bookingTime}時`}
						isFullButton
					/>
				</div>
				<div className="flex justify-center space-x-2">
					<button
						className="btn btn-outline w-40"
						onClick={() => router.push('/booking')}
					>
						コマ表に戻る
					</button>
				</div>
			</div>
			<AddCalendarPopup
				bookingDetail={bookingDetail}
				isPopupOpen={isPopupOpen}
				setIsPopupOpen={setIsPopupOpen}
				calendarAddPopupRef={calendarAddPopupRef}
			/>
		</div>
	)
}

export default BookingDetail
