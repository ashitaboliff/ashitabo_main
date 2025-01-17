'use client'

import { format } from 'date-fns'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import { BookingDetailProps } from '@/types/BookingTypes'

import { FaApple, FaYahoo } from 'react-icons/fa'
import { SiGooglecalendar } from 'react-icons/si'

const AddCalendarPopup = ({
	calendarTime,
	bookingDetail,
	isPopupOpen,
	setIsPopupOpen,
	calendarAddPopupRef,
}: {
	calendarTime: string[]
	bookingDetail: BookingDetailProps
	isPopupOpen: boolean
	setIsPopupOpen: (arg: boolean) => void
	calendarAddPopupRef: React.RefObject<PopupRef>
}) => {
	const bookingDate = calendarTime[bookingDetail.bookingTime]
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
		)

	return (
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
							Android
						</button>
						<button
							className="btn btn-outline btn-sm btn-active"
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
							iPhone
						</button>
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
	)
}

export default AddCalendarPopup
