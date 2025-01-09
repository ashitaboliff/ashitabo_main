'use server'

import React from 'react'
import BookingDetail from '@/components/booking/BookingDetail'
import { getCalendarTimeAction } from '@/components/booking/actions'

const Page = async () => {
	const calendarTime = await getCalendarTimeAction()
	if (calendarTime.status !== 200) {
		return null
	}
	return <BookingDetail calendarTime={calendarTime.response} />
}

export default Page
