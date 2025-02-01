'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import AuthPadLock from './AuthPadLock'

const PadLockMain = () => {
	const [auth, setAuth] = useState<boolean>(false)

	const handleSignIn = async () => {
		await signIn('line', {
			callbackUrl: '/auth/signin/setting',
			maxAge: 6 * 30 * 24 * 60 * 60, // 6 months
			checks: ['state'],
		})
	}

	return auth ? (handleSignIn(), null) : <AuthPadLock setAuth={setAuth} />
}

export default PadLockMain
