'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import AuthPadLock from '@/features/auth/components/AuthPadLock'
import AuthErrorPage from '@/features/auth/components/AuthErrorPage'

const PadLockMain = () => {
	const [auth, setAuth] = useState<boolean>(false)
	const [error, setError] = useState<string>()

	const handleSignIn = async () => {
		try {
			await signIn('line', {
				callbackUrl: '/auth/signin/setting',
				maxAge: 6 * 30 * 24 * 60 * 60, // 6 months
				checks: ['state'],
			})
		} catch (error) {
			setError(String(error))
		}
	}

	useEffect(() => {
		if (auth) {
			handleSignIn()
		}
	}, [auth])

	if (error) {
		return <AuthErrorPage error={error} />
	}

	return <AuthPadLock />
}

export default PadLockMain
