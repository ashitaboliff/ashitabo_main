'use server'

import { redirectFrom } from '@/app/actions'
import { getSession, sessionCheck } from '@/app/actions'
import { getCalendarTimeAction } from '@/components/booking/actions'
import { getProfileAction } from '@/app/actions'
import { getUserRoleAction } from '@/components/admin/action'
import { Profile } from '@/types/UserTypes'
import UserPage from '@/components/user/UserPage'
import { notFound } from 'next/navigation'
import { createMetaData } from '@/utils/MetaData'

export async function metadata() {
	return createMetaData({
		title: 'ユーザーページ',
		description: '自分のした予約などを確認できます',
		url: '/user',
	})
}

const userPage = async () => {
	const session = await getSession()
	const isSession = await sessionCheck(session)
	const calendarTime = await getCalendarTimeAction()
	if (calendarTime.status !== 200) {
		return notFound()
	}
	if (isSession === 'no-session' || !session) {
		await redirectFrom('/auth/signin', '/user')
	} else if (isSession === 'session') {
		await redirectFrom('/auth/signin/setting', '/user')
	} else {
		const userRole = await getUserRoleAction(session.user.id)
		if (userRole.status !== 200) {
			return notFound()
		}
		const profile = await getProfileAction(session.user.id)
		if (profile.status === 200) {
			return (
				<UserPage
					profile={profile.response as Profile}
					session={session}
					calendarTime={calendarTime.response}
					userRole={userRole.response}
				/>
			)
		} else {
			await redirectFrom('/auth/signin/setting', '/user')
		}
	}
}

export default userPage
