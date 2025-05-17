'use server'

import { notFound } from 'next/navigation'
import AdminMain from '@/features/admin/components/AdminMain'
import { getUserRoleAction } from '@/features/admin/components/action'
import { getSession } from '@/app/actions'
import SessionForbidden from '@/components/ui/atoms/SessionNotFound'

const Page = async () => {
	const session = await getSession()
	if (!session) {
		return <SessionForbidden />
	}

	const userRole = await getUserRoleAction(session.user.id)
	if (userRole.response === 'USER' || userRole.status !== 200) {
		return notFound()
	}

	return <AdminMain />
}

export default Page
