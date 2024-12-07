'use server'

import SigninSetting from '@/components/auth/SigninSetting'
import { getSession, sessionCheck } from '@/app/actions'
import { redirect } from 'next/navigation'

const Signin = async () => {
	const session = await getSession()
	console.log(session)
	const isSession = await sessionCheck(session)

	if (isSession === 'no-session') {
		redirect('/auth/signin')
	} else if (isSession === 'profile') {
		redirect('/user')
	} else {
		return <SigninSetting />
	}
}

export default Signin
