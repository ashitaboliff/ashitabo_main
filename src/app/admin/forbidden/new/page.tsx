'use server'

'use server'

import { notFound } from 'next/navigation'
import BanBookingCreate from '@/components/admin/ForbiddenBookingCreate'
import { getSession } from '@/app/actions'
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

	return <BanBookingCreate calendarTime={calendarTime.response} />
}

export default Page
