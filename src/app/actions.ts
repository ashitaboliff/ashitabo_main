'use server'

import { auth } from '@/features/auth/lib/authOption'
import { Session } from 'next-auth'
import { redirect } from 'next/navigation'
import { getAllBookingId, getAllYoutubeId } from '@/db/Root'

export async function getSession(): Promise<Session | null> {
	return await auth()
}

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
