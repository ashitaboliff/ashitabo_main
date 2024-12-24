'use server'

import { Suspense } from 'react'
import Loading from '@/components/atoms/Loading'
import AuthPadLock from '@/components/auth/AuthPadLock'
import { getSession, sessionCheck } from '@/app/actions'
import { redirect } from 'next/navigation'

const Page = () => {
	return (
		<Suspense fallback={<Loading />}>
			<AuthPadLock />
		</Suspense>
	)
}

export default Page
