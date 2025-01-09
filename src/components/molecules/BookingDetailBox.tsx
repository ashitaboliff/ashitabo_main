'use client'

import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import BaseTable from '@/components/atoms/BaseTable'

interface BookingDetailProps {
	booking_date: string
	booking_time: number
	regist_name: string
	name: string
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
			value: format(props.booking_date, 'yyyy年MM月dd日(E)', { locale: ja }),
		},
		{
			label: '時間',
			value: calendarTime[props.booking_time],
		},
		{
			label: 'バンド名',
			value: props.regist_name,
		},
		{
			label: '責任者',
			value: props.name,
		},
	]

	return <BaseTable data={data} title="予約詳細" />
}

export default BookingDetailBox
