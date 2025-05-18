'use server'

import { notFound } from 'next/navigation'
import ForbiddenBookingPage from '@/features/admin/components/ForbiddenBookingPage'
import { getSession } from '@/app/actions'
import { getAllBanBookingAction } from '@/features/admin/components/action'
import SessionForbidden from '@/components/ui/atoms/SessionNotFound'

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
