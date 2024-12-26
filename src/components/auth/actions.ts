'use server'

import { ApiResponse, StatusCode } from '@/types/ResponseTypes'
import {
	getProfile,
	checkPadLock,
	getUser,
	createProfile,
	updateProfile,
} from '@/db/Auth'
import { cookies } from 'next/headers'
import { Profile, User } from '@/types/UserTypes'

const oneDay = 60 * 60 * 24
const oneMonth = 60 * 60 * 24 * 30

export async function padLockAction(
	password: string,
): Promise<ApiResponse<string>> {
	const cookieStore = cookies()
	let failCount = Number(cookieStore.get('failCount')?.value) || 0

	try {
		const match = await checkPadLock(password)

		if (match) {
			cookieStore.set('failCount', '0', { maxAge: oneDay }) // 一日持つ
			cookieStore.set('isLocked', 'false', { maxAge: oneMonth }) // 一か月持つ
			return { status: StatusCode.NO_CONTENT }
		} else {
			if (failCount >= 5) {
				cookies().set('isLocked', 'true', { maxAge: oneDay }) // 一日持つ
				return {
					status: StatusCode.FORBIDDEN,
					response: 'パスワードを5回以上間違えたため、ログインできません',
				}
			} else {
				failCount += 1
				cookies().set('failCount', failCount.toString(), { maxAge: oneDay }) // 一日持つ
				return {
					status: StatusCode.BAD_REQUEST,
					response: 'パスワードが違います',
				}
			}
		}
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function padLockCookieAction(): Promise<
	'locked' | 'unlocked' | 'no-cookie'
> {
	const cookieStore = cookies()
	const existCookie = cookieStore.has('isLocked')
	const isLocked = cookieStore.get('isLocked')?.value

	if (!existCookie) return 'no-cookie'
	if (isLocked === 'true') return 'locked'
	return 'unlocked'
}

export async function getUserAction(
	user_id: string,
): Promise<ApiResponse<string | User>> {
	try {
		const user = await getUser(user_id)
		return user
			? { status: StatusCode.OK, response: user }
			: {
					status: StatusCode.NOT_FOUND,
					response: 'このidのユーザは存在しません',
				}
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function createProfileAction(
	user_id: string,
	body: Omit<Profile, 'id'>,
): Promise<ApiResponse<string>> {
	try {
		const user = await getUser(user_id)
		if (!user)
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このidのユーザは存在しません',
			}
		const profile = await getProfile(user_id)
		if (profile)
			return {
				status: StatusCode.BAD_REQUEST,
				response: 'このユーザは既にプロフィールが設定されています',
			}
		await createProfile(user_id, body)
		return { status: StatusCode.CREATED, response: 'success' }
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function putProfileAction(
	user_id: string,
	body: Omit<Profile, 'id'>,
): Promise<ApiResponse<string>> {
	try {
		const user = await getUser(user_id)
		if (!user)
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このidのユーザは存在しません',
			}
		const profile = await getProfile(user_id)
		if (!profile)
			return {
				status: StatusCode.BAD_REQUEST,
				response: 'このユーザはプロフィールが設定されていません',
			}
		await updateProfile(user_id, body)
		return { status: StatusCode.OK, response: 'success' }
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}
