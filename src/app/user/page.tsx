'use server'

import { redirectFrom } from '@/app/actions'
import { getSession, sessionCheck } from '@/app/actions'
import { getProfileAction } from '@/app/actions'
import { getUserRoleAction } from '@/features/admin/components/action'
import { Profile } from '@/features/user/types'
import UserPage from '@/features/user/components/UserPage'
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
					userRole={userRole.response}
				/>
			)
		} else {
			await redirectFrom('/auth/signin/setting', '/user')
		}
	}
}

export default userPage
