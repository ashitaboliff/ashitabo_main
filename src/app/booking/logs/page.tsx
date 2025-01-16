'use server'

import React from 'react'
import BookingLogs from '@/components/booking/BookingLogs'
import {
	getCalendarTimeAction,
	getAllBookingAction,
} from '@/components/booking/actions'

const BookingLog = async () => {
	const calendarTime = await getCalendarTimeAction()
	if (calendarTime.status !== 200) return { notFound: true }
	const bookingLog = await getAllBookingAction()
	if (bookingLog.status !== 200) return { notFound: true }

	return (
		<BookingLogs
			calendarTime={calendarTime.response}
			bookingLog={bookingLog.response}
		/>
	)
}

export default BookingLog
