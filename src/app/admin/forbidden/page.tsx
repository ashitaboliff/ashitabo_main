'use server'

import { notFound } from 'next/navigation'
import ForbiddenBookingPage from '@/components/admin/ForbiddenBookingPage'
import { getSession } from '@/app/actions'
import { getAllBanBookingAction } from '@/components/admin/action'
import { getCalendarTimeAction } from '@/components/booking/actions'

const Page = async () => {
	const session = await getSession()
	if (!session) {
		return notFound()
	}

	const calendarTime = await getCalendarTimeAction()
	if (calendarTime.status !== 200) {
		return notFound()
	}

	const banBooking = await getAllBanBookingAction()
	if (banBooking.status !== 200) {
		return notFound()
	}

	return (
		<ForbiddenBookingPage
			banBooking={banBooking.response}
			calendarTime={calendarTime.response}
		/>
	)
}

export default Page
