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
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
				<h1 className="text-3xl font-bold">予約ログ</h1>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<span className="text-sm">表示件数:</span>
						<SelectField
							value={logsPerPage}
							onChange={(e) => {
								setLogsPerPage(Number(e.target.value))
								setCurrentPage(1)
							}}
							options={{ 10: '10件', 20: '20件', 50: '50件', 100: '100件' }}
							name="logsPerPage"
							className="select select-bordered select-sm" // daisyUIクラス適用
						/>
					</div>
					<button
						className="btn btn-primary btn-sm" // サイズ調整
						onClick={async () =>
							await bookingRevalidateTagAction({ tag: 'booking' })
						}
					>
						予約情報を更新
					</button>
				</div>
			</div>

			{currentLogs.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{currentLogs.map((log) => (
						<div
							key={log.id}
							className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
							onClick={() => {
								setIsPopupOpen(true)
								setPopupData(log)
							}}
						>
							<div className="card-body p-5">
								<div className="flex justify-between items-start mb-2">
									<h2 className="card-title text-lg">
										{log.registName}
									</h2>
									{log.isDeleted && (
										<div className="badge badge-error gap-1">
											<TiDeleteOutline size={16} />
											削除済
										</div>
									)}
								</div>
								<p className="text-sm text-base-content/70">
									{format(log.bookingDate, 'yyyy年MM月dd日 (E)', { locale: ja })}
								</p>
								<p className="text-sm text-base-content/70">
									{BookingTime[log.bookingTime]}
								</p>
								<p className="text-sm mt-1">
									<span className="font-semibold">責任者:</span> {log.name}
								</p>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-10">
					<p className="text-xl text-base-content/70">予約ログはありません。</p>
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
				ref={popupRef}
				title="予約詳細"
				maxWidth="md" // 少し小さく
				open={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
			>
				{/* ポップアップ内容もカードスタイルに */}
				<div className="card-body p-0"> {/* card-bodyのデフォルトパディングを削除し、内部で調整 */}
					<dl className="space-y-1 p-4 text-sm"> {/* パディングとフォントサイズ調整 */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1">
							<dt className="font-semibold sm:col-span-1">予約ID:</dt>
							<dd className="sm:col-span-2 break-all">{popupData?.id}</dd>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1 border-t border-base-300">
							<dt className="font-semibold sm:col-span-1">予約日:</dt>
							<dd className="sm:col-span-2">
								{popupData &&
									format(new Date(popupData.bookingDate), 'yyyy年MM月dd日 (E)', { locale: ja })}
							</dd>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1 border-t border-base-300">
							<dt className="font-semibold sm:col-span-1">予約時間:</dt>
							<dd className="sm:col-span-2">{popupData && BookingTime[popupData.bookingTime]}</dd>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1 border-t border-base-300">
							<dt className="font-semibold sm:col-span-1">バンド名:</dt>
							<dd className="sm:col-span-2 break-all">{popupData?.registName}</dd>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1 border-t border-base-300">
							<dt className="font-semibold sm:col-span-1">責任者:</dt>
							<dd className="sm:col-span-2 break-all">{popupData?.name}</dd>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1 border-t border-base-300">
							<dt className="font-semibold sm:col-span-1">作成日時:</dt>
							<dd className="sm:col-span-2">
								{popupData &&
									format(new Date(popupData.createdAt), 'yyyy/MM/dd HH:mm:ss', { locale: ja })}
							</dd>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1 border-t border-base-300">
							<dt className="font-semibold sm:col-span-1">更新日時:</dt>
							<dd className="sm:col-span-2">
								{popupData &&
									format(new Date(popupData.updatedAt), 'yyyy/MM/dd HH:mm:ss', { locale: ja })}
							</dd>
						</div>
						{popupData?.buyStatus && (
							<>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1 border-t border-base-300">
									<dt className="font-semibold sm:col-span-1">支払い状況:</dt>
									<dd className="sm:col-span-2">{BuyBookingStatusMap[popupData.buyStatus]}</dd>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1 border-t border-base-300">
									<dt className="font-semibold sm:col-span-1">支払い期限:</dt>
									<dd className="sm:col-span-2">
										{popupData.buyExpiredAt
											? format(new Date(popupData.buyExpiredAt), 'yyyy/MM/dd', { locale: ja })
											: 'N/A'}
									</dd>
								</div>
							</>
						)}
					</dl>
					<div className="card-actions justify-end p-4 border-t border-base-300">
						<button
							className="btn btn-ghost btn-sm" // サイズ調整
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
