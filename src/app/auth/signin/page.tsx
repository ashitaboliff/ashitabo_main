'use server'

import SigninPage from '@/components/auth/SigninPage'
import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
import { padLockCookieAction } from '@/components/auth/actions'

/**
 * cookieがあって、セッションがない場合、このページを表示
 */
const Signin = async () => {
	const session = await getSession()
	const isSession = await sessionCheck(session)

	if (isSession === 'profile') {
		await redirectFrom('/user', '/auth/signin')
	} else if (isSession === 'session') {
		await redirectFrom('/auth/signin/setting', '/auth/signin')
	} else {
		if ((await padLockCookieAction()) === 'unlocked') {
			return <SigninPage />
		} else {
			await redirectFrom('/auth/padlock', '/auth/signin')
		}
	}

	return <SigninPage />
}

export default Signin
