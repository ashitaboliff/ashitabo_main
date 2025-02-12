'use server'

import { notFound } from 'next/navigation'
import ForbiddenBookingPage from '@/components/admin/ForbiddenBookingPage'
import { getSession } from '@/app/actions'
import { getAllBanBookingAction } from '@/components/admin/action'
import SessionForbidden from '@/components/atoms/SessionNotFound'

const Page = async () => {
	const session = await getSession()
	if (!session) {
		return <SessionForbidden />
	}

	const banBooking = await getAllBanBookingAction()
	if (banBooking.status !== 200) {
		return notFound()
	}

	return <ForbiddenBookingPage banBooking={banBooking.response} />
}

export default Page
