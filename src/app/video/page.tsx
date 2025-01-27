'use server'

import { notFound } from 'next/navigation'
import YoutubeMainPage from '@/components/video/YoutubeMainPage'
import { getPlaylistAction } from '@/components/video/actions'

const Page = async () => {
	return <YoutubeMainPage />
}

export default Page
