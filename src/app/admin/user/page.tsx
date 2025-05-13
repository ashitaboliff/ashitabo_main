'use server'

import { notFound } from 'next/navigation'
import AdminUserPage from '@/features/admin/components/AdminUserPage'
import { getUserRoleAction } from '@/features/admin/components/action'
import { getSession } from '@/app/actions'

const Page = async () => {
	const session = await getSession()
	if (!session) {
		return notFound()
	}

	const userRole = await getUserRoleAction(session.user.id)
	if (userRole.response === 'user' || userRole.status !== 200) {
		return notFound()
	}

	return <AdminUserPage session={session} />
}

export default Page
