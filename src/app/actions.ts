'use server'

import { ApiResponse, StatusCode } from '@/types/ResponseTypes'
import { auth } from '@/lib/auth/AuthOption'
import { Session } from 'next-auth'
import { redirect } from 'next/navigation'
import { getProfile, getUser } from '@/db/Auth'
import { Profile } from '@/types/UserTypes'

export async function getSession() {
	return await auth()
}

export async function getProfileAction(
	user_id: string,
): Promise<ApiResponse<Profile | string>> {
	try {
		const user = await getUser(user_id)
		if (!user)
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このidのユーザは存在しません',
			}
		const profile = await getProfile(user_id)
		return profile
			? { status: StatusCode.OK, response: profile }
			: {
					status: StatusCode.NOT_FOUND,
					response: 'このユーザはプロフィールが設定されていません',
				}
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function sessionCheck(
	session: Session | null,
): Promise<'session' | 'no-session' | 'profile'> {
	let isSession: 'session' | 'no-session' | 'profile' = 'no-session'
	if (session) {
		const userId = session.user.id
		const isProfile = await getProfileAction(userId)
		if (isProfile.status === StatusCode.OK) {
			isSession = 'profile'
		} else {
			isSession = 'session'
		}
	}
	return isSession
}

export async function redirectFrom(path: string, from: string): Promise<void> {
	const redirectPath = `${path}?from=${encodeURIComponent(from)}`
	redirect(redirectPath)
}
