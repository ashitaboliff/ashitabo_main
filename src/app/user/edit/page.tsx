'use server'

import { redirectFrom } from '@/app/actions'
import { getSession, sessionCheck } from '@/app/actions'
import { getProfileAction } from '@/app/actions'
import { Profile } from '@/types/UserTypes'
import ProfileEdit from '@/features/user/components/ProfileEdit'

export async function metadata() {
	return {
		title: 'プロフィール編集',
		description: 'プロフィールを編集します',
		url: '/user/edit',
	}
}

const userPage = async () => {
	const session = await getSession()
	const isSession = await sessionCheck(session)
	if (isSession === 'no-session' || !session) {
		await redirectFrom('/auth/signin', '/user/edit')
	} else if (isSession === 'session') {
		await redirectFrom('/auth/signin/setting', '/user/edit')
	} else {
		const profile = await getProfileAction(session.user.id)
		if (profile.status === 200) {
			return <ProfileEdit profile={profile.response as Profile} />
		} else {
			await redirectFrom('/auth/signin/setting', '/user/edit')
		}
	}
}

export default userPage
