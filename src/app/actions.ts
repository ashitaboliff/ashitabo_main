'use server'

import { auth } from '@/features/auth/lib/AuthOption'
import { Session } from 'next-auth' // Session型は引き続き使用
import { redirect } from 'next/navigation'
// import { getProfile, getUser } from '@/features/auth/lib/repository' // 不要になるため削除
import { getAllBookingId, getAllYoutubeId } from '@/db/Root'
// import { Profile } from '@/features/user/types' // Session型に含まれるため、直接のインポートは不要になる可能性
// ApiResponseとStatusCodeはgetProfileActionが削除されるため、ここでは不要になる可能性。他の関数で使われていなければ削除。
// import { ApiResponse, StatusCode } from '@/utils/types/ResponseTypes'

export async function getSession(): Promise<Session | null> {
	// 返り値の型を明示
	return await auth()
}

// getProfileActionはSessionにProfile情報が含まれるため不要になります。
// 必要に応じて、この関数を呼び出している箇所を修正する必要があります。
/*
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
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}
*/

export async function sessionCheck(
	session: Session | null,
): Promise<'session' | 'no-session' | 'profile'> {
	if (!session?.user?.id) {
		// ユーザーIDがなければ 'no-session'
		return 'no-session'
	}
	// session.user.is_profile は AuthOption.tsx の session コールバックで設定される想定
	if (session.user.is_profile) {
		return 'profile' // プロファイル情報がセッションにあり
	}
	return 'session' // セッションはあるがプロファイル情報なし
}

export async function redirectFrom(path: string, from: string): Promise<void> {
	const redirectPath = `${path}?from=${encodeURIComponent(from)}`
	redirect(redirectPath)
}

export async function getBookingIdAction(): Promise<string[]> {
	const bookingId = await getAllBookingId()
	return bookingId
}

export async function getYoutubeIdAction(): Promise<string[]> {
	const youtubeId = await getAllYoutubeId()
	return youtubeId
}
