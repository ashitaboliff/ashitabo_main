'use client'

import { useRef, useState } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { bookingRevalidateTagAction } from './actions'
import {
	BookingLog,
	BuyBookingStatusMap,
	BookingTime,
} from '@/features/booking/types'
import Popup, { PopupRef } from '@/components/ui/molecules/Popup'
import Pagination from '@/components/ui/atoms/Pagination'
import SelectField from '@/components/ui/atoms/SelectField'

import { TiDeleteOutline } from 'react-icons/ti'

const LogsPage = ({
	bookingLog,
}: {
	bookingLog: BookingLog[] | undefined | null
}) => {
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [logsPerPage, setLogsPerPage] = useState(10)
	const [popupData, setPopupData] = useState<BookingLog | undefined | null>(
		bookingLog?.[0] ?? undefined,
	)
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)

	const totalLogs = bookingLog?.length ?? 0
	const pageMax = Math.ceil(totalLogs / logsPerPage)

	const indexOfLastLog = currentPage * logsPerPage
	const indexOfFirstLog = indexOfLastLog - logsPerPage
	const currentLogs = bookingLog?.slice(indexOfFirstLog, indexOfLastLog) ?? []

	return (
		<div className="container mx-auto px-2 sm:px-4 py-8">
			<div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
				<h1 className="text-2xl sm:text-3xl font-bold">予約ログ</h1>
				<div className="flex flex-col xs:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
					<div className="flex items-center gap-2 w-full xs:w-auto">
						<span className="text-sm whitespace-nowrap">表示件数:</span>
						<SelectField
							value={logsPerPage}
							onChange={(e) => {
								setLogsPerPage(Number(e.target.value))
								setCurrentPage(1)
							}}
							options={{ 10: '10件', 20: '20件', 50: '50件', 100: '100件' }}
							name="logsPerPage"
							className="select select-bordered select-sm w-full xs:w-auto"
						/>
					</div>
					<button
						className="btn btn-primary btn-sm w-full xs:w-auto"
						onClick={async () =>
							await bookingRevalidateTagAction({ tag: 'booking' })
						}
					>
						予約情報を更新
					</button>
				</div>
			</div>

			{currentLogs.length > 0 ? (
				<div className="overflow-x-auto shadow-md rounded-lg">
					<table className="table table-zebra w-full">
						<thead className="bg-base-200">
							<tr>
								<th className="p-3 text-left text-xs sm:text-sm font-semibold tracking-wider w-10 sm:w-12"></th>
								<th className="p-3 text-left text-xs sm:text-sm font-semibold tracking-wider">
									予約日
								</th>
								<th className="p-3 text-left text-xs sm:text-sm font-semibold tracking-wider hidden sm:table-cell">
									時間
								</th>
								<th className="p-3 text-left text-xs sm:text-sm font-semibold tracking-wider">
									バンド名
								</th>
								<th className="p-3 text-left text-xs sm:text-sm font-semibold tracking-wider hidden md:table-cell">
									責任者
								</th>
							</tr>
						</thead>
						<tbody className="bg-base-100 divide-y divide-base-300">
							{currentLogs.map((log) => (
								<tr
									key={log.id}
									className="hover:bg-base-200 cursor-pointer transition-colors duration-200"
									onClick={() => {
										setIsPopupOpen(true)
										setPopupData(log)
									}}
								>
									<td className="p-3 whitespace-nowrap text-center">
										{log.isDeleted && (
											<div className="tooltip tooltip-error" data-tip="削除済">
												<TiDeleteOutline className="text-error" size={20} />
											</div>
										)}
									</td>
									<td className="p-3 whitespace-nowrap text-xs sm:text-sm">
										{format(log.bookingDate, 'yyyy/MM/dd (E)', { locale: ja })}
									</td>
									<td className="p-3 whitespace-nowrap text-xs sm:text-sm hidden sm:table-cell">
										{BookingTime[log.bookingTime]}
									</td>
									<td className="p-3 text-xs sm:text-sm break-words">
										{log.registName}
									</td>
									<td className="p-3 whitespace-nowrap text-xs sm:text-sm hidden md:table-cell">
										{log.name}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="text-center py-10 card bg-base-100 shadow">
					<div className="card-body">
						<p className="text-xl text-base-content/70">
							予約ログはありません。
						</p>
					</div>
				</div>
			)}

			{pageMax > 1 && (
				<div className="mt-8 flex justify-center">
					<Pagination
						currentPage={currentPage}
						totalPages={pageMax}
						onPageChange={(page) => setCurrentPage(page)}
					/>
				</div>
			)}

			<Popup
				id={`popup-${popupData?.id}`}
				ref={popupRef}
				title="予約詳細"
				maxWidth="lg" // ポップアップは少し広めでも良い
				open={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
			>
				<div className="p-4 sm:p-6">
					<dl className="space-y-2 text-sm sm:text-base">
						{[
							{ label: '予約ID', value: popupData?.id, break: true },
							{
								label: '予約日',
								value:
									popupData &&
									format(
										new Date(popupData.bookingDate),
										'yyyy年MM月dd日 (E)',
										{ locale: ja },
									),
							},
							{
								label: '予約時間',
								value: popupData && BookingTime[popupData.bookingTime],
							},
							{ label: 'バンド名', value: popupData?.registName, break: true },
							{ label: '責任者', value: popupData?.name, break: true },
							{
								label: '作成日時',
								value:
									popupData &&
									format(new Date(popupData.createdAt), 'yyyy/MM/dd HH:mm:ss', {
										locale: ja,
									}),
							},
							{
								label: '更新日時',
								value:
									popupData &&
									format(new Date(popupData.updatedAt), 'yyyy/MM/dd HH:mm:ss', {
										locale: ja,
									}),
							},
						].map((item, index) =>
							item.value ? (
								<div
									key={index}
									className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-b border-base-300 last:border-b-0"
								>
									<dt className="font-semibold text-base-content/80 sm:col-span-1">
										{item.label}:
									</dt>
									<dd
										className={`sm:col-span-2 ${item.break ? 'break-all' : 'whitespace-nowrap'}`}
									>
										{item.value}
									</dd>
								</div>
							) : null,
						)}
						{popupData?.buyStatus && (
							<>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-t border-base-300">
									<dt className="font-semibold text-base-content/80 sm:col-span-1">
										支払い状況:
									</dt>
									<dd className="sm:col-span-2">
										{BuyBookingStatusMap[popupData.buyStatus]}
									</dd>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-t border-base-300">
									<dt className="font-semibold text-base-content/80 sm:col-span-1">
										支払い期限:
									</dt>
									<dd className="sm:col-span-2">
										{popupData.buyExpiredAt
											? format(new Date(popupData.buyExpiredAt), 'yyyy/MM/dd', {
													locale: ja,
												})
											: 'N/A'}
									</dd>
								</div>
							</>
						)}
					</dl>
					<div className="mt-6 flex justify-end">
						<button
							className="btn btn-ghost"
							onClick={() => {
								setIsPopupOpen(false)
							}}
						>
							閉じる
						</button>
					</div>
				</div>
			</Popup>
		</div>
	)
}

export default LogsPage
