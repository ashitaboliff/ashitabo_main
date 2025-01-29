'use server'

import SigninSetting from '@/components/auth/SigninSetting'
import { getSession, sessionCheck, redirectFrom } from '@/app/actions'

const Signin = async () => {
	const session = await getSession()
	const isSession = await sessionCheck(session)

	if (isSession === 'no-session') {
		await redirectFrom('/auth/signin', '/auth/signin/setting')
	} else if (isSession === 'profile') {
		await redirectFrom('/user', '/auth/signin/setting')
	}

	return <SigninSetting />
}

export default Signin
