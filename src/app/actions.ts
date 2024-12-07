'use server'

import { getProfileAction } from '@/components/auth/actions'
import { auth } from '@/lib/auth/AuthOption'
import { Session } from 'next-auth'

export async function getSession() {
	return await auth()
}

export async function sessionCheck(session: Session | null) {
	let isSession: 'session' | 'no-session' | 'profile' = 'no-session'
	if (session) {
		const userId = session.user.id
		const isProfile = await getProfileAction(userId)
		console.log(isProfile)
		if (isProfile.status === 200) {
			isSession = 'profile'
		} else {
			isSession = 'session'
		}
	}
	return isSession
}
