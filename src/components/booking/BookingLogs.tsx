'use client'

import { useRef, useState } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { bookingRevalidateTagAction } from './actions'
import { BookingLog, BuyBookingStatusMap } from '@/types/BookingTypes'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import SelectField from '@/components/atoms/SelectField'

import { TiDeleteOutline } from 'react-icons/ti'

const BookingLogs = ({
	calendarTime,
	bookingLog,
}: {
	calendarTime: string[]
	bookingLog: BookingLog[]
}) => {
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [logsPerPage, setLogsPerPage] = useState(10)
	const [popupData, setPopupData] = useState<BookingLog>(bookingLog[0])
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)

	const totalLogs = bookingLog.length
	const pageMax = Math.ceil(totalLogs / logsPerPage)

	const indexOfLastLog = currentPage * logsPerPage
	const indexOfFirstLog = indexOfLastLog - logsPerPage
	const currentLogs = bookingLog.slice(indexOfFirstLog, indexOfLastLog)

	return (
		<div className="flex flex-col items-center justify-center gap-y-2">
			<h1 className="text-2xl font-bold">予約ログ</h1>
			<button
				className="btn btn-primary btn-md"
				onClick={async () =>
					await bookingRevalidateTagAction({ tag: 'booking' })
				}
			>
				予約情報を更新
			</button>
			<div className="overflow-x-auto w-full flex flex-col justify-center gap-y-2">
				<div className="flex flex-row items-center ml-auto space-x-2 w-1/2">
					<p className="text-sm whitespace-nowrap">表示件数:</p>
					<SelectField
						value={logsPerPage}
						onChange={(e) => {
							setLogsPerPage(Number(e.target.value))
							setCurrentPage(1)
						}}
						options={{ 10: '10件', 20: '20件', 50: '50件', 100: '100件' }}
						name="logsPerPage"
					/>
				</div>
				<table className="table table-zebra table-sm w-full max-w-36 justify-center">
					<thead>
						<tr>
							<th className="w-16"></th>
							<th className="font-bold">予約日</th>
							<th className="font-bold">予約時間</th>
							<th className="font-bold">バンド名</th>
							<th className="font-bold">責任者</th>
							{/* <th>作成日</th>
						<th>更新日</th> */}
						</tr>
					</thead>
					<tbody>
						{currentLogs?.map((log) => (
							<tr
								key={log.id}
								className="cursor-pointer"
								onClick={() => {
									setIsPopupOpen(true)
									setPopupData(log)
								}}
							>
								<td>
									{log.isDeleted && (
										<div className="badge badge-error text-bg-light">
											<TiDeleteOutline className="inline" />
										</div>
									)}
								</td>
								<td className="text-xxs">
									{format(log.bookingDate, 'yyyy年MM月dd日', { locale: ja })}
								</td>
								<td className="text-xxs">{calendarTime[log.bookingTime]}</td>
								<td className="text-xxs">{log.registName}</td>
								<td className="text-xxs">{log.name}</td>
								{/* <td>{log.created_at}</td>
								<td>{log.updated_at}</td> */}
							</tr>
						))}
					</tbody>
				</table>
				<div className="join justify-center">
					{Array.from({ length: pageMax }, (_, i) => (
						<button
							key={i}
							className={`join-item btn ${currentPage === i + 1 ? ' btn-primary' : 'btn-outline'}`}
							onClick={() => setCurrentPage(i + 1)}
						>
							{i + 1}
						</button>
					))}
				</div>

				<Popup
					ref={popupRef}
					title="予約詳細"
					maxWidth="lg"
					open={isPopupOpen}
					onClose={() => setIsPopupOpen(false)}
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
							{popupData.buyStatus && (
								<>
									<div className="font-bold">支払い状況:</div>
									<div>{BuyBookingStatusMap[popupData.buyStatus]}</div>
									<div className="font-bold">支払い期限:</div>
									<div>
										{popupData.buyExpiredAt
											? format(
													new Date(popupData.buyExpiredAt),
													'yyyy年MM月dd日',
													{ locale: ja },
												)
											: 'N/A'}
									</div>
								</>
							)}
						</div>
						<button
							className="btn btn-outline"
							onClick={() => {
								setIsPopupOpen(false)
							}}
						>
							閉じる
						</button>
					</div>
				</Popup>
			</div>
		</div>
	)
}

export default BookingLogs
