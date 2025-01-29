'use server'

import NewBooking from '@/components/booking/BookingCreate'
import { getSession, redirectFrom } from '../../actions'
import { getCalendarTimeAction } from '@/components/booking/actions'
import { notFound } from 'next/navigation'

const Page = async () => {
	const session = await getSession()
	if (!session) {
		redirectFrom('/auth/signin', '/booking/new')
		return null
	}
	const calendarTime = await getCalendarTimeAction()
	if (calendarTime.status !== 200) {
		return notFound()
	}
	return <NewBooking calendarTime={calendarTime.response} session={session} />
}

export default Page
