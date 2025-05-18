'use server'

import AuthErrorPage from '@/features/auth/components/AuthErrorPage'

const Page = () => {
	return <AuthErrorPage error="Internal Server Error" />
}

export default Page
