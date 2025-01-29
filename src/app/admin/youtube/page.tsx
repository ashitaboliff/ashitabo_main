'use server'

import { notFound } from 'next/navigation'
import YoutubeManagement from '@/components/admin/YoutubeManagement'
import {
	getAccessTokenAction,
	getPlaylistAction,
} from '@/components/video/actions'
import { getUserRoleAction } from '@/components/admin/action'
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
