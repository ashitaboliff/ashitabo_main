'use server'

import { notFound } from 'next/navigation'
import AdminMain from '@/components/admin/AdminMain'
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

	return <AdminMain />
}

export default Page
