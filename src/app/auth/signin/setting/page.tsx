'use server'

import SigninSetting from '@/features/auth/components/SigninSetting'
import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
import { createMetaData } from '@/utils/metaData'

export async function metadata() {
	return createMetaData({
		title: 'あしたぼコマ表ユーザー設定ページ',
		description: 'あしたぼコマ表のユーザー設定ページ',
		url: '/auth/signin/setting',
	})
}

const Signin = async () => {
	const session = await getSession()
	const sessionStatus = await sessionCheck(session) // isSession -> sessionStatus

	if (sessionStatus === 'no-session') {
		// セッションがなければサインインページへ
		const redirectPath = `/auth/signin?from=${encodeURIComponent('/auth/signin/setting')}`
		await redirectFrom(redirectPath, '')
		return null // redirect後は何もレンダリングしない
	} else if (sessionStatus === 'profile') {
		// 既にプロファイル設定済みならユーザーページへ
		const redirectPath = `/user?from=${encodeURIComponent('/auth/signin/setting')}`
		await redirectFrom(redirectPath, '')
		return null // redirect後は何もレンダリングしない
	}
	// 'session' (プロファイル未設定) の場合は設定ページを表示
	return <SigninSetting />
}

export default Signin
