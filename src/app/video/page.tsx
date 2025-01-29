'use server'

import { notFound } from 'next/navigation'
import YoutubeMainPage from '@/components/video/YoutubeMainPage'
import { Suspense } from 'react'

const Page = async () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<YoutubeMainPage />
		</Suspense>
	)
}

export default Page
