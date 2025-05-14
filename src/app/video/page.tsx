'use server'

import Loading from '@/components/ui/atoms/Loading'
import VideoListPage from '@/features/video/components/VideoListPage' // 修正
import { Suspense } from 'react'

const Page = async () => {
	return (
		<Suspense fallback={<Loading />}>
			<VideoListPage />
		</Suspense>
	)
}

export default Page
