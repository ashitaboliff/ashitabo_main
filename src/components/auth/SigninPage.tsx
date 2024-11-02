'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import Loading from '@/components/atoms/Loading'

const SigninPage = () => {
	const session = useSession()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	if (isLoading) {
		return <Loading />
	}

	if (session) {
		console.log('a:', session)
	}

	return (
		<div>
			<div>新規アカウント作成</div>
			<div
				className="btn btn-primary"
				onClick={() =>
					signIn('line', {
						redirectTo: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin/setting`,
					})
				}
			>
				{' '}
				{/*{redirectTo: `${process.env.NEXTAUTH_URL}/signin/setting`}*/}
				LINEでログイン
			</div>
		</div>
	)
}

export default SigninPage
