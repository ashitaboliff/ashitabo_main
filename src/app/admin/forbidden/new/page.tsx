'use server'

import BanBookingCreate from '@/features/admin/components/ForbiddenBookingCreate'
import { getSession } from '@/app/actions'
import SessionForbidden from '@/components/ui/atoms/SessionNotFound'

const Page = async () => {
	const session = await getSession()
	if (!session) {
		return <SessionForbidden />
	}

	return <BanBookingCreate />
}

export default Page
