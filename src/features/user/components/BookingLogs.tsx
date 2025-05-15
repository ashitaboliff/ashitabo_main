'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { Session } from 'next-auth' // Session might still be needed for other parts or can be removed if userId is the only thing used from it by the parent
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Booking, BookingTime } from '@/features/booking/types'
import Pagination from '@/components/ui/atoms/Pagination'
import SelectFieldNumber from '@/components/ui/atoms/SelectFieldNumber'
import Popup, { PopupRef } from '@/components/ui/molecules/Popup'
import AddCalendarPopup from '@/components/ui/molecules/AddCalendarPopup'
import { getBookingByUserIdAction } from '@/features/booking/components/actions' // This action will be called by the parent Server Component

interface UserBookingLogsProps {
  session: Session; // Or just userId: string if that's all that's needed from session by parent for fetching
  initialBookings: Booking[];
  initialPageMax: number;
  initialCurrentPage: number;
  initialLogsPerPage: number;
  initialSort: 'new' | 'old';
}

const UserBookingLogs = ({
  session,
  initialBookings,
  initialPageMax,
  initialCurrentPage,
  initialLogsPerPage,
  initialSort,
}: UserBookingLogsProps) => {
	const router = useRouter()
	const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage)
	const [logsPerPage, setLogsPerPage] = useState(initialLogsPerPage)
	const [sort, setSort] = useState<'new' | 'old'>(initialSort)
	const [popupData, setPopupData] = useState<Booking>()
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const [isAddCalendarPopupOpen, setIsAddCalendarPopupOpen] =
		useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)
	const addCalendarPopupRef = useRef<PopupRef>(undefined)

	// bookings and pageMax are now derived from props
	const bookings = initialBookings;
	const pageMax = initialPageMax;

	const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`?page=${page}&limit=${logsPerPage}&sort=${sort}`, { scroll: false });
  };

  const handleLogsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLogsPerPage = parseInt(e.target.value);
    setLogsPerPage(newLogsPerPage);
    setCurrentPage(1); // Reset to first page when logs per page changes
    router.push(`?page=1&limit=${newLogsPerPage}&sort=${sort}`, { scroll: false });
  };

  const handleSortChange = (newSort: 'new' | 'old') => {
    setSort(newSort);
    setCurrentPage(1); // Reset to first page when sort changes
    router.push(`?page=1&limit=${logsPerPage}&sort=${newSort}`, { scroll: false });
  };

	return (
		<div className="flex flex-col justify-center">
			<div className="flex flex-col">
				<div className="flex flex-row items-center ml-auto space-x-2 w-1/2">
					<p className="text-sm whitespace-nowrap">表示件数:</p>
					<SelectFieldNumber
						name="logsPerPage"
						options={{ '10件': 10, '20件': 20, '30件': 30 }}
						value={logsPerPage}
						onChange={handleLogsPerPageChange}
					/>
				</div>
				<div className="flex flex-row gap-x-2">
					<input
						type="radio"
						name="sort"
						value="new"
						checked={sort === 'new'}
						className="btn btn-tetiary btn-sm"
						aria-label="新しい順"
						onChange={() => handleSortChange('new')}
					/>
					<input
						type="radio"
						name="sort"
						value="old"
						checked={sort === 'old'}
						className="btn btn-tetiary btn-sm"
						aria-label="古い順"
						onChange={() => handleSortChange('old')}
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
								<td className="text-xs">{BookingTime[booking.bookingTime]}</td>
								<td className="text-xs">{booking.registName}</td>
								<td className="text-xs">{booking.name}</td>
							</tr>
						))}
					</tbody>
				</table>
				<Pagination
					currentPage={currentPage}
					totalPages={pageMax}
					onPageChange={handlePageChange}
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
								<div>{BookingTime[popupData.bookingTime]}</div>
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
