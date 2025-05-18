'use server'

import { notFound } from 'next/navigation'
import YoutubeManagement from '@/features/admin/components/YoutubeManagement'
import {
	getAccessTokenAction,
	getPlaylistAction,
} from '@/features/video/components/actions'
import { getUserRoleAction } from '@/features/admin/components/action'
import { getSession } from '@/app/actions'

const Page = async () => {
	const session = await getSession()
	if (!session) {
		return notFound()
	}

	const userRole = await getUserRoleAction(session.user.id)
	if (userRole.response === 'user' || userRole.status !== 200) {
		return notFound()
	}

	const accessToken = await getAccessTokenAction()
	const playlist = await getPlaylistAction()
	if (playlist.status !== 200) {
		return notFound()
	}
	return (
		<YoutubeManagement
			playlists={playlist.response}
			isAccessToken={accessToken.status === 200}
		/>
	)
}

export default Page
