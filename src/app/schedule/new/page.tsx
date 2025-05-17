'use server'

import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
import { getUserIdWithNames } from '@/features/schedule/components/actions' // Import the action
import SessionForbidden from '@/components/ui/atoms/SessionNotFound'
import { createMetaData } from '@/utils/metaData'
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

	const usersRes = await getUserIdWithNames()
	let initialUsers: Record<string, string> = {}
	if (usersRes.status === 200) {
		initialUsers = usersRes.response.reduce(
			(acc, user) => {
				acc[user.id ?? ''] = user.name ?? ''
				return acc
			},
			{} as Record<string, string>,
		)
	} else {
		// Handle error case, e.g., log it or show an error message
		console.error('Failed to fetch mention users:', usersRes.response)
	}

	return <ScheduleCreatePage session={session} initialUsers={initialUsers} />
}

export default Page
