'use client'

import { useState } from 'react' 
import AuthPadLock from '@/features/auth/components/AuthPadLock'
import AuthErrorPage from '@/features/auth/components/AuthErrorPage' 

const PadLockMain = () => {
	const [error, setError] = useState<string>()

	if (error) {
		return <AuthErrorPage error={error} />
	}

	return <AuthPadLock />
}

export default PadLockMain
