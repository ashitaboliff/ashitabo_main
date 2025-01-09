'use server'

import React, { Suspense } from 'react'
import NewBooking from '@/components/booking/BookingCreate'
import Loading from '@/components/atoms/Loading'
import { getSession } from '../../actions'
import { getCalendarTimeAction } from '@/components/booking/actions'

const Page = async () => {
	const session = await getSession()
	if (!session) {
		return null
	}
	const calendarTime = await getCalendarTimeAction()
	if (calendarTime.status !== 200) {
		return null
	}
	return <NewBooking calendarTime={calendarTime.response} session={session} />
}

export default Page
