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
		<div className="container mx-auto flex flex-col items-center">
			<BookingDetailBox
				props={{
					bookingDate: bookingDetail.bookingDate,
					bookingTime: bookingDetail.bookingTime,
					registName: bookingDetail.registName,
					name: bookingDetail.name,
					isPaidStatus: bookingDetail.isPaidStatus,
				}}
			/>
			<div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-2 w-full max-w-md">
				<button
					className="btn btn-primary w-full sm:w-auto"
					onClick={() => router.push(`/booking/${bookingDetail?.id}/edit`)}
				>
					編集
				</button>
				<button
					className="btn btn-accent btn-outline w-full sm:w-auto" // tetiary から accent に変更 (daisyUIの標準的な色)
					onClick={() => setIsPopupOpen(true)}
				>
					スマホに追加
				</button>
				<ShareButton
					url={pathname}
					title="LINEで共有"
					text={`予約日時: ${format(
						new Date(bookingDetail.bookingDate), // Dateオブジェクトに変換
						'yyyy/MM/dd(E)',
						{
							locale: ja,
						},
					)} ${BookingTime[Number(bookingDetail.bookingTime)]}`}
					isFullButton
				/>
			</div>
			<div className="mt-4 flex justify-center w-full max-w-md">
				<button
					className="btn btn-ghost w-full sm:w-auto" // outline から ghost に変更
					onClick={() => router.push('/booking')}
				>
					コマ表に戻る
				</button>
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
