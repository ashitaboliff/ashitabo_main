'use server'

import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
import SessionForbidden from '@/components/ui/atoms/SessionNotFound'
import { createMetaData } from '@/utils/MetaData'
import ScheduleCreatePage from '@/features/schedule/components/CreatePage'

export async function metadata() {
	return createMetaData({
		title: '日程調整新規作成',
		url: '/schedule/new',
	})
}

const Page = async () => {
	const session = await getSession()
	const isSession = await sessionCheck(session)

	if (isSession !== 'profile' || !session) {
		await redirectFrom('/auth/signin', '/schedule/new')
		return <SessionForbidden />
	}
	return <ScheduleCreatePage session={session} />
}

export default Page
