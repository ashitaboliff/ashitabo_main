'use server'

import SigninPage from '@/features/auth/components/SigninPage'
import SessionForbidden from '@/components/ui/atoms/SessionNotFound'
import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
import { createMetaData } from '@/utils/MetaData'

export async function metadata() {
	return createMetaData({
		title: 'あしたぼコマ表利用登録ページ',
		description: 'あしたぼコマ表の利用登録はこちらから',
		url: '/auth/signin',
	})
}

/**
 * セッションがない場合、このページを表示
 */
const Signin = async () => {
	const session = await getSession()
	const sessionStatus = await sessionCheck(session) // isSession -> sessionStatus

	if (sessionStatus === 'profile') {
		// 既にプロファイル設定済みならユーザーページへ
		const redirectPath = `/user?from=${encodeURIComponent('/auth/signin')}`
		await redirectFrom(redirectPath, '')
		return null // redirect後は何もレンダリングしない
	} else if (sessionStatus === 'session') {
		// セッションはあるがプロファイル未設定なら設定ページへ
		const redirectPath = `/auth/signin/setting?from=${encodeURIComponent('/auth/signin')}`
		await redirectFrom(redirectPath, '')
		return null // redirect後は何もレンダリングしない
	}
	// 'no-session' の場合、または予期せぬ状態の場合はサインインページを表示
	return <SigninPage />
}

export default Signin
