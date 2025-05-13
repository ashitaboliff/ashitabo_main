'use server'

import { notFound } from 'next/navigation'
import LogsPage from '@/features/booking/components/Logs' // インポート名とパスを変更
import { getAllBookingAction } from '@/features/booking/components/actions'
import { createMetaData } from '@/utils/MetaData'

export async function metadata() {
	return createMetaData({
		title: 'あしたぼコマ表予約ログ',
		url: '/booking/logs',
	})
}

const BookingLog = async () => {
	const bookingLog = await getAllBookingAction()
	if (bookingLog.status !== 200) return notFound()

	return <LogsPage bookingLog={bookingLog.response} />
}

export default BookingLog
