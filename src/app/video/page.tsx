'use server'

import Loading from '@/components/atoms/Loading'
import YoutubeMainPage from '@/components/video/YoutubeMainPage'
import { Suspense } from 'react'

const Page = async () => {
	return (
		<Suspense fallback={<Loading />}>
			<YoutubeMainPage />
		</Suspense>
	)
}

export default Page
