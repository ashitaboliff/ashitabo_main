'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { adminRevalidateTagAction, updateBuyBookingAction } from './action'
import { getBookingByIdAction } from '@/features/booking/components/actions'
import { ErrorType } from '@/utils/types/responseTypes'
import {
	Booking,
	BuyBooking,
	BuyBookingStatus,
	BuyBookingStatusMap,
	BookingTime,
} from '@/features/booking/types'
import Pagination from '@/components/ui/atoms/Pagination'
import SelectField from '@/components/ui/atoms/SelectField'
import Popup, { PopupRef } from '@/components/ui/molecules/Popup'

interface PopupProps {
	booking?: BuyBooking
	detail?: Booking | null
}

const TopAdminBuyPage = ({ buyBookings }: { buyBookings: BuyBooking[] }) => {
	const router = useRouter()
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [bookingsPerPage, setBookingsPerPage] = useState(10)
	const [popupData, setPopupData] = useState<PopupProps | undefined>()
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)
	const [error, setError] = useState<ErrorType>()
	const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState<boolean>(false)
	const successPopupRef = useRef<PopupRef>(undefined)

	const totalBookings = buyBookings?.length ?? 0
	const pageMax = Math.ceil(totalBookings / bookingsPerPage)

	const indexOfLastBooking = currentPage * bookingsPerPage
	const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
	const currentBookings =
		buyBookings?.slice(indexOfFirstBooking, indexOfLastBooking) ?? []

	const onUpdate = async (id: string | undefined, status: BuyBookingStatus) => {
		if (!id) return
		const res = await updateBuyBookingAction({ bookingId: id, state: status })
		if (res.status === 200) {
			setPopupData(undefined)
			setIsPopupOpen(false)
			setIsSuccessPopupOpen(true)
		} else {
			setError(res)
		}
	}

	return (
		<div className="flex flex-col items-center justify-center gap-y-2">
			<h1 className="text-2xl font-bold">予約購入管理</h1>
			<button
				className="btn btn-primary btn-md"
				onClick={async () => await adminRevalidateTagAction('buyBooking')}
			>
				予約情報を更新
			</button>
			<div className="overflow-x-auto w-full flex flex-col justify-center gap-y-2">
				<div className="flex flex-row items-center ml-auto space-x-2 w-1/2">
					<p className="text-sm whitespace-nowrap">表示件数:</p>
					<SelectField
						value={bookingsPerPage}
						onChange={(e) => {
							setBookingsPerPage(Number(e.target.value))
							setCurrentPage(1)
						}}
						options={{ 10: '10件', 20: '20件', 50: '50件', 100: '100件' }}
						name="usersPerPage"
					/>
				</div>
				<table className="table table-zebra table-sm w-full max-w-36 justify-center">
					<thead>
						<tr>
							<th>予約ID</th>
							<th>ユーザID</th>
							<th>ステータス</th>
							<th>期限日</th>
						</tr>
					</thead>
					<tbody>
						{currentBookings.map((booking) => (
							<tr
								key={booking.id}
								onClick={async () => {
									const detail = await getBookingByIdAction(booking.bookingId)
									if (
										detail.status !== 200 &&
										typeof detail.response === 'string'
									) {
										setError(detail)
										return
									} else {
										setPopupData({ booking: booking, detail: detail.response })
										setIsPopupOpen(true)
										setError(undefined)
									}
								}}
							>
								<td>{booking.id}</td>
								<td>{booking.userId}</td>
								<td>{BuyBookingStatusMap[booking.status]}</td>
								<td>
									{format(new Date(booking.expiredAt), 'yyyy/MM/dd HH:mm', {
										locale: ja,
									})}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Pagination
				currentPage={currentPage}
				totalPages={pageMax}
				onPageChange={(page) => setCurrentPage(page)}
			/>
			<div className="flex flex-row justify-center mt-2">
				<button
					className="btn btn-outline"
					onClick={() => router.push('/admin')}
				>
					戻る
				</button>
			</div>
			<Popup
				id={`buy-booking-popup-${popupData?.booking?.id}`}
				ref={popupRef}
				open={isPopupOpen}
				onClose={() => {
					setIsPopupOpen(false)
					setError(undefined)
				}}
				title="予約購入詳細"
			>
				{popupData && (
					<div className="flex flex-col gap-y-2">
						<div className="flex flex-col gap-y-2">
							<h2 className="text-lg font-bold">予約情報</h2>
							<div className="flex flex-col gap-y-2">
								<p>予約ID: {popupData.booking?.id}</p>
								<p>ユーザID: {popupData.booking?.userId}</p>
								<p>
									ステータス:{' '}
									{popupData?.booking?.status
										? BuyBookingStatusMap[popupData.booking.status]
										: '不明'}
								</p>
								<p>
									期限日:{' '}
									{popupData.booking?.expiredAt
										? format(
												new Date(popupData.booking.expiredAt),
												'yyyy/MM/dd HH:mm',
												{ locale: ja },
											)
										: '未設定'}
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-y-2">
							<h2 className="text-lg font-bold">予約詳細</h2>
							<div className="flex flex-col gap-y-2">
								<p>予約ID: {popupData.detail?.id}</p>
								<p>ユーザID: {popupData.detail?.userId}</p>
								<p>登録名: {popupData.detail?.registName}</p>
								<p>名前: {popupData.detail?.name}</p>
								<p>予約日: {popupData.detail?.bookingDate}</p>
								<p>
									予約時間:{' '}
									{popupData.detail?.bookingTime !== undefined
										? BookingTime[popupData.detail.bookingTime]
										: '不明'}
								</p>
							</div>
						</div>
						<div className="flex flex-row gap-x-2 justify-center">
							<button
								className="btn btn-primary"
								onClick={() => onUpdate(popupData.booking?.bookingId, 'PAID')}
							>
								支払済み
							</button>
							<button
								className="btn btn-outline btn-secondary"
								onClick={() =>
									onUpdate(popupData.booking?.bookingId, 'EXPIRED')
								}
							>
								支払い期限切れ
							</button>
							<button
								className="btn btn-outline"
								onClick={() => setIsPopupOpen(false)}
							>
								閉じる
							</button>
						</div>
						{error && (
							<p className="text-error text-center">
								エラーコード{error.status}:{error.response}
							</p>
						)}
					</div>
				)}
			</Popup>
			<Popup
				id="buy-booking-success-popup"
				ref={successPopupRef}
				open={isSuccessPopupOpen}
				onClose={() => setIsSuccessPopupOpen(false)}
				title="更新完了"
			>
				<div className="flex flex-col gap-y-2">
					<p>更新が完了しました</p>
					<button
						className="btn btn-primary"
						onClick={() => setIsSuccessPopupOpen(false)}
					>
						閉じる
					</button>
				</div>
			</Popup>
		</div>
	)
}

export default TopAdminBuyPage
