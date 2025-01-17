'use server'

import React, { Suspense } from 'react'
import NewBooking from '@/components/booking/BookingCreate'
import { getSession, redirectFrom } from '../../actions'
import { getCalendarTimeAction } from '@/components/booking/actions'

const Page = async () => {
	const session = await getSession()
	if (!session) {
		redirectFrom('/auth/signin', '/booking/new')
		return null
	}
	const calendarTime = await getCalendarTimeAction()
	if (calendarTime.status !== 200) {
		return { notFound: true }
	}
	return <NewBooking calendarTime={calendarTime.response} session={session} />
}

export default Page
