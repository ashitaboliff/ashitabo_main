'use server'

import { notFound } from 'next/navigation'
import BookingLogs from '@/components/booking/BookingLogs'
import { getAllBookingAction } from '@/components/booking/actions'
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

	return <BookingLogs bookingLog={bookingLog.response} />
}

export default BookingLog
