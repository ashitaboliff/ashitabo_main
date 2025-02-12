'use client'

import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import BaseTable from '@/components/atoms/BaseTable'
import {
	BuyBookingStatus,
	BuyBookingStatusMap,
	BookingTime,
} from '@/types/BookingTypes'

interface BookingDetailProps {
	bookingDate: string
	bookingTime: number
	registName: string
	name: string
	isPaidStatus?: BuyBookingStatus
}

const BookingDetailBox = ({ props }: { props: BookingDetailProps }) => {
	const data = [
		{
			label: '日付',
			value: format(props.bookingDate, 'yyyy年MM月dd日(E)', { locale: ja }),
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

	return <BaseTable data={data} title="予約詳細" />
}

export default BookingDetailBox
