'use server'

import AuthErrorPage from '@/components/auth/AuthErrorPage'

const Page = () => {
	return <AuthErrorPage error="Internal Server Error" />
}

export default Page
