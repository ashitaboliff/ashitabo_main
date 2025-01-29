'use server'

import { notFound } from 'next/navigation'
import PadLockEdit from '@/components/admin/PadLockEdit'
import {
	getUserRoleAction,
	getAllPadLocksAction,
} from '@/components/admin/action'
import { getSession } from '@/app/actions'
import SessionForbidden from '@/components/atoms/SessionNotFound'

const Page = async () => {
	const session = await getSession()
	if (!session) {
		return <SessionForbidden />
	}

	const userRole = await getUserRoleAction(session.user.id)
	if (userRole.response === 'user' || userRole.status !== 200) {
		return notFound()
	}

	const padLocks = await getAllPadLocksAction()
	if (padLocks.status !== 200) {
		return notFound()
	}

	return <PadLockEdit padLocks={padLocks.response} />
}

export default Page
