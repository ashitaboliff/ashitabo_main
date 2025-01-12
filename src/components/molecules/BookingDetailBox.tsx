'use client'

import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import BaseTable from '@/components/atoms/BaseTable'
import { BuyBookingStatus, BuyBookingStatusMap } from '@/types/BookingTypes'

interface BookingDetailProps {
	bookingDate: string
	bookingTime: number
	registName: string
	name: string
	isPaidStatus?: BuyBookingStatus
}

const BookingDetailBox = ({
	props,
	calendarTime,
}: {
	props: BookingDetailProps
	calendarTime: string[]
}) => {
	const data = [
		{
			label: '日時',
			value: format(props.bookingDate, 'yyyy年MM月dd日(E)', { locale: ja }),
		},
		{
			label: '時間',
			value: calendarTime[props.bookingTime],
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
