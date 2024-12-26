'use server'

import { redirectFrom } from '@/app/actions'
import { getSession, sessionCheck } from '@/app/actions'
import { getProfileAction } from '@/app/actions'
import { Profile } from '@/types/UserTypes'
import UserPage from '@/components/user/UserPage'

const userPage = () => {
	const main = async () => {
		const session = await getSession()
		const isSession = await sessionCheck(session)
		if (isSession === 'no-session' || !session) {
			await redirectFrom('/auth/signin', '/user')
		} else if (isSession === 'session') {
			await redirectFrom('/auth/signin/setting', '/user')
		} else {
			const profile = await getProfileAction(session.user.id)
			if (profile.status === 200) {
				return (
					<UserPage profile={profile.response as Profile} session={session} />
				)
			} else {
				await redirectFrom('/auth/signin/setting', '/user')
			}
		}
	}

	return <>{main()}</>
}

export default userPage
