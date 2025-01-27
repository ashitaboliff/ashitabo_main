'use server'

import { notFound } from 'next/navigation'
import YoutubeMainPage from '@/components/video/YoutubeMainPage'

const Page = async () => {
	return <YoutubeMainPage />
}

export default Page
