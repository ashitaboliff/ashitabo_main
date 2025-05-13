'use server'

import SigninSetting from '@/features/auth/components/SigninSetting'
import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
import { createMetaData } from '@/utils/MetaData'

export async function metadata() {
	return createMetaData({
		title: 'あしたぼコマ表ユーザー設定ページ',
		description: 'あしたぼコマ表のユーザー設定ページ',
		url: '/auth/signin/setting',
	})
}

const Signin = async () => {
	const session = await getSession()
	const isSession = await sessionCheck(session)

	if (isSession === 'no-session') {
		await redirectFrom('/auth/signin', '/auth/signin/setting')
	} else if (isSession === 'profile') {
		await redirectFrom('/user', '/auth/signin/setting')
	}

	return <SigninSetting />
}

export default Signin
