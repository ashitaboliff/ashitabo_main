'use client'

import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
// BaseTable のインポートを削除
import {
	BuyBookingStatus,
	BuyBookingStatusMap,
	BookingTime,
} from '@/features/booking/types'
import { ReactNode } from 'react'

interface BookingDetailItem {
	label: string
	value: string | ReactNode
}

interface BookingDetailProps {
	bookingDate: string
	bookingTime: number
	registName: string
	name: string
	isPaidStatus?: BuyBookingStatus
}

const BookingDetailBox = ({ props }: { props: BookingDetailProps }) => {
	const data: BookingDetailItem[] = [
		{
			label: '日付',
			value: format(new Date(props.bookingDate), 'yyyy年MM月dd日(E)', { locale: ja }),
		},
		{
			label: '時間',
			value: BookingTime[props.bookingTime],
		},
		{
			label: 'バンド名',
			value: props.registName,
		},
		{
			label: '責任者',
			value: props.name,
		},
	]
	if (props.isPaidStatus) {
		data.push({
			label: '支払状況',
			value: BuyBookingStatusMap[props.isPaidStatus],
		})
	}

	const title = "予約詳細"

	return (
		<div className="card w-full max-w-md bg-base-100 shadow-xl mx-auto my-4">
			<div className="card-body">
				<h2 className="card-title justify-center text-2xl">{title}</h2>
				<div className="divider my-1"></div>
				{/* 各項目をリストまたはテーブル形式で表示 */}
				<dl className="space-y-2">
					{data.map((item, index) => (
						<div
							key={index}
							// 小さい画面ではラベルと値が縦、sm以上で横並び、グリッドで整形
							className="grid grid-cols-1 sm:grid-cols-3 gap-1 items-center py-2 border-b border-base-300 last:border-b-0"
						>
							<dt className="font-semibold text-base-content sm:col-span-1">
								{item.label}
							</dt>
							<dd className="text-base-content sm:col-span-2 break-words">
								{item.value}
							</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	)
}

export default BookingDetailBox
