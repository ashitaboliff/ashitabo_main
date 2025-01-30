'use server'

import NewBooking from '@/components/booking/BookingCreate'
import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
import { getCalendarTimeAction } from '@/components/booking/actions'
import { notFound } from 'next/navigation'
import SessionForbidden from '@/components/atoms/SessionNotFound'

const Page = async () => {
	const session = await getSession()
	const isSession = await sessionCheck(session)

	if (isSession !== 'profile' || !session) {
		await redirectFrom('/auth/signin', '/booking/new')
		return <SessionForbidden />
	}
	const calendarTime = await getCalendarTimeAction()
	if (calendarTime.status !== 200) {
		return notFound()
	}
	return <NewBooking calendarTime={calendarTime.response} session={session} />
}

export default Page
