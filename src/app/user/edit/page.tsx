'use server'

import { redirectFrom } from '@/app/actions'
import { getSession, sessionCheck } from '@/app/actions'
import { getProfileAction } from '@/app/actions'
import { Profile } from '@/types/UserTypes'
import ProfileEdit from '@/components/user/ProfileEdit'

const userPage = () => {
	const main = async () => {
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

	return <>{main()}</>
}

export default userPage
