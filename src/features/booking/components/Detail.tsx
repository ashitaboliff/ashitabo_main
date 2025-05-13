'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { usePathname } from 'next/navigation'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale/ja'
import { BookingDetailProps, BookingTime } from '@/features/booking/types'
import ShareButton from '@/components/ui/atoms/ShareButton'
import { PopupRef } from '@/components/ui/molecules/Popup'
import AddCalendarPopup from '@/components/ui/molecules/AddCalendarPopup'
import BookingDetailBox from '@/components/ui/molecules/BookingDetailBox'
import DetailNotFoundPage from '@/features/booking/components/DetailNotFound' // インポート名とパスを変更

const DetailPage = ({
	bookingDetail,
}: {
	bookingDetail: BookingDetailProps
}) => {
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const calendarAddPopupRef = useRef<PopupRef>(undefined)
	const router = useRouter()
	const pathname = usePathname()

	if (!bookingDetail) {
		return <DetailNotFoundPage />
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
						text={`予約日時: ${format(
							bookingDetail.bookingDate,
							'yyyy/MM/dd(E)',
							{
								locale: ja,
							},
						)} ${BookingTime[Number(bookingDetail.bookingTime)]}`}
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

export default DetailPage // export名も変更
