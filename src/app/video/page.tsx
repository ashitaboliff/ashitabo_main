'use server'

import Loading from '@/components/ui/atoms/Loading'
import YoutubeMainPage from '@/features/video/components/YoutubeMainPage'
import { Suspense } from 'react'

const Page = async () => {
	return (
		<Suspense fallback={<Loading />}>
			<YoutubeMainPage />
		</Suspense>
	)
}

export default Page
