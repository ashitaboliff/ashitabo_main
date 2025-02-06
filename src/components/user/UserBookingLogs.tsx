'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { Session } from 'next-auth'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Booking } from '@/types/BookingTypes'
import Pagination from '@/components/atoms/Pagination'
import SelectFieldNumber from '@/components/atoms/SelectFieldNumber'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import AddCalendarPopup from '@/components/molecules/AddCalendarPopup'
import { getBookingByUserIdAction } from '@/components/booking/actions'

const UserBookingLogs = ({
	session,
	calendarTime,
}: {
	session: Session
	calendarTime: string[]
}) => {
	const router = useRouter()
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [logsPerPage, setLogsPerPage] = useState(10)
	const [sort, setSort] = useState<'new' | 'old'>('new')
	const [popupData, setPopupData] = useState<Booking>()
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const [isAddCalendarPopupOpen, setIsAddCalendarPopupOpen] =
		useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)
	const addCalendarPopupRef = useRef<PopupRef>(undefined)

	const [pageMax, setPageMax] = useState<number>(1)
	const [bookings, setBookings] = useState<Booking[]>([])

	useEffect(() => {
		const fetchBooking = async () => {
			const res = await getBookingByUserIdAction({
				userId: session.user.id,
				sort: sort,
				page: currentPage,
				perPage: logsPerPage,
			})
			if (res.status === 200) {
				setBookings(res.response.bookings)
				setPageMax(Math.ceil(res.response.totalCount / logsPerPage))
			}
		}
		fetchBooking()
	}, [currentPage, logsPerPage, sort])

	return (
		<div className="flex flex-col justify-center">
			<div className="flex flex-col">
				<div className="flex flex-row items-center ml-auto space-x-2 w-1/2">
					<p className="text-sm whitespace-nowrap">表示件数:</p>
					<SelectFieldNumber
						name="logsPerPage"
						options={{ '10件': 10, '20件': 20, '30件': 30 }}
						value={logsPerPage}
						onChange={(e) => setLogsPerPage(parseInt(e.target.value))}
					/>
				</div>
				<div className="flex flex-row gap-x-2">
					<input
						type="radio"
						name="sort"
						value="new"
						defaultChecked
						className="btn btn-tetiary btn-sm"
						aria-label="新しい順"
						onChange={() => setSort('new')}
					/>
					<input
						type="radio"
						name="sort"
						value="old"
						className="btn btn-tetiary btn-sm"
						aria-label="古い順"
						onChange={() => setSort('old')}
					/>
				</div>
				<table className="table table-zebra table-sm w-full max-w-36 justify-center my-2">
					<thead>
						<tr>
							<th className="font-bold">予約日</th>
							<th className="font-bold">予約時間</th>
							<th className="font-bold">バンド名</th>
							<th className="font-bold">管理者</th>
						</tr>
					</thead>
					<tbody>
						{bookings.map((booking, index) => (
							<tr
								key={index}
								onClick={() => {
									setPopupData(booking)
									setIsPopupOpen(true)
								}}
							>
								<td className="text-xs">
									{format(new Date(booking.bookingDate), 'yyyy年MM月dd日', {
										locale: ja,
									})}
								</td>
								<td className="text-xs">{calendarTime[booking.bookingTime]}</td>
								<td className="text-xs">{booking.registName}</td>
								<td className="text-xs">{booking.name}</td>
							</tr>
						))}
					</tbody>
				</table>
				<Pagination
					currentPage={currentPage}
					totalPages={pageMax}
					onPageChange={(page) => setCurrentPage(page)}
				/>
			</div>
			{popupData && (
				<>
					<Popup
						open={isPopupOpen}
						onClose={() => setIsPopupOpen(false)}
						ref={popupRef}
						title="予約詳細"
					>
						<div className="flex flex-col space-y-2 text-sm">
							<div className="grid grid-cols-2 gap-2">
								<div className="font-bold">予約id:</div>
								<div>{popupData.id}</div>
								<div className="font-bold">予約日:</div>
								<div>
									{format(popupData.bookingDate, 'yyyy年MM月dd日', {
										locale: ja,
									})}
								</div>
								<div className="font-bold">予約時間:</div>
								<div>{calendarTime[popupData.bookingTime]}</div>
								<div className="font-bold">バンド名:</div>
								<div>{popupData.name}</div>
								<div className="font-bold">責任者:</div>
								<div>{popupData.registName}</div>
								<div className="font-bold">作成日:</div>
								<div>
									{format(popupData.createdAt, 'yyyy年MM月dd日hh時mm分ss秒', {
										locale: ja,
									})}
								</div>
								<div className="font-bold">更新日:</div>
								<div>
									{format(popupData.updatedAt, 'yyyy年MM月dd日hh時mm分ss秒', {
										locale: ja,
									})}
								</div>
							</div>
							<div className="flex justify-center space-x-2">
								<button
									type="button"
									className="btn btn-primary"
									onClick={() => setIsAddCalendarPopupOpen(true)}
								>
									スマホのカレンダーに追加
								</button>
								<button
									className="btn btn-outline"
									onClick={() => {
										setIsPopupOpen(false)
									}}
								>
									閉じる
								</button>
							</div>
						</div>
					</Popup>
					<AddCalendarPopup
						calendarTime={calendarTime}
						bookingDetail={popupData}
						isPopupOpen={isAddCalendarPopupOpen}
						setIsPopupOpen={setIsAddCalendarPopupOpen}
						calendarAddPopupRef={addCalendarPopupRef}
					/>
				</>
			)}
		</div>
	)
}

export default UserBookingLogs
