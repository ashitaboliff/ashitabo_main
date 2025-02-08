'use server'

import { notFound } from 'next/navigation'
import AdminUserPage from '@/components/admin/AdminUserPage'
import { getUserRoleAction } from '@/components/admin/action'
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
