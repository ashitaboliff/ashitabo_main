'use server'

import { redirect } from 'next/navigation'
import { getSession, sessionCheck } from '@/app/actions'
import { getProfileAction } from '@/app/actions'
import { Profile } from '@/types/UserTypes'
import UserPage from '@/components/user/UserPage'

const userPage = () => {
	const main = async () => {
		const session = await getSession()
		const isSession = await sessionCheck(session)
		if (isSession === 'no-session' || !session) {
			redirect('/auth/signin')
		} else if (isSession === 'session') {
			redirect('/auth/signin/setting')
		} else {
			const profile = await getProfileAction(session.user.id)
			if (profile.status === 200) {
				return (
					<UserPage profile={profile.response as Profile} session={session} />
				)
			} else {
				redirect('/auth/signin/setting')
			}
		}
	}

	return <>{main()}</>
}

export default userPage
