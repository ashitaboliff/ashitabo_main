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
	const sessionStatus = await sessionCheck(session) // isSession -> sessionStatus

	// sessionStatusが 'profile' でない場合、または session自体がない場合はリダイレクト
	if (sessionStatus !== 'profile' || !session?.user?.id) {
		const redirectPath = `/auth/signin?from=${encodeURIComponent('/schedule/new')}`
		await redirectFrom(redirectPath, '')
		return null // redirect後は何もレンダリングしない
	}
	// ここに来る場合は sessionStatus === 'profile' かつ session.user.id が存在する
	return <ScheduleCreatePage session={session} />
}

export default Page
