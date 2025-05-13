'use server'

import AuthPadLock from '@/features/auth/components/AuthPadLock'
import SessionForbidden from '@/components/ui/atoms/SessionNotFound'
import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
import { createMetaData } from '@/utils/MetaData'

export async function metadata() {
	return createMetaData({
		title: 'あしたぼコマ表利用登録ページ',
		description: 'あしたぼコマ表の利用登録ページです',
		url: '/auth/padlock',
	})
}

const Page = async () => {
	const session = await getSession()
	const sessionStatus = await sessionCheck(session) // isSession -> sessionStatus

	if (sessionStatus === 'profile') {
		// 既にプロファイル設定済みならユーザーページへ
		const redirectPath = `/user?from=${encodeURIComponent('/auth/padlock')}` // from を修正
		await redirectFrom(redirectPath, '')
		return null // redirect後は何もレンダリングしない
	} else if (sessionStatus === 'session') {
		// セッションはあるがプロファイル未設定なら設定ページへ
		const redirectPath = `/auth/signin/setting?from=${encodeURIComponent('/auth/padlock')}` // from を修正
		await redirectFrom(redirectPath, '')
		return null // redirect後は何もレンダリングしない
	}
	// 'no-session' の場合、または予期せぬ状態の場合はPadLockページを表示
	return <AuthPadLock />
}

export default Page
