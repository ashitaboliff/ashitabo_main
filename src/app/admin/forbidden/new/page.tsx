'use server'

import BanBookingCreate from '@/components/admin/ForbiddenBookingCreate'
import { getSession } from '@/app/actions'
import SessionForbidden from '@/components/atoms/SessionNotFound'

const Page = async () => {
	const session = await getSession()
	if (!session) {
		return <SessionForbidden />
	}

	return <BanBookingCreate />
}

export default Page
