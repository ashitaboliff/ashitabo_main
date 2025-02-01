'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import AuthPadLock from '@/components/auth/AuthPadLock'
import AuthErrorPage from '@/components/auth/AuthErrorPage'

const PadLockMain = () => {
	const [auth, setAuth] = useState<boolean>(false)

	const handleSignIn = async () => {
		try {
			await signIn('line', {
				callbackUrl: '/auth/signin/setting',
				maxAge: 6 * 30 * 24 * 60 * 60, // 6 months
				checks: ['state'],
			})
		} catch (error) {
			return <AuthErrorPage error={String(error)} />
		}
	}

	return auth ? (handleSignIn(), null) : <AuthPadLock setAuth={setAuth} />
}

export default PadLockMain
