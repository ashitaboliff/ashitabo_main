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
import { revalidateTag } from 'next/cache'

const oneDay = 60 * 60 * 24

export async function padLockAction(
	password: string,
): Promise<ApiResponse<string>> {
	const cookieStore = await cookies()
	let failCount = Number(cookieStore.get('failCount')?.value) || 0

	try {
		const match = await checkPadLock(password)

		if (match) {
			cookieStore.set('failCount', '0', { maxAge: oneDay }) // 一日持つ
			return { status: StatusCode.NO_CONTENT }
		} else {
			if (failCount >= 5) {
				return {
					status: StatusCode.FORBIDDEN,
					response: 'パスワードを5回以上間違えたため、ログインできません',
				}
			} else {
				failCount += 1
				cookieStore.set('failCount', failCount.toString(), { maxAge: oneDay }) // 一日持つ
				return {
					status: StatusCode.BAD_REQUEST,
					response: 'パスワードが違います',
				}
			}
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
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
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
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
		revalidateTag('users')
		return { status: StatusCode.CREATED, response: 'success' }
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
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
		revalidateTag('users')
		return { status: StatusCode.OK, response: 'success' }
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}
