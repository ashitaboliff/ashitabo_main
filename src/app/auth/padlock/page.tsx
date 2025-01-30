'use server'

import PadLockMain from '@/components/auth/PadLockMain'
import SessionForbidden from '@/components/atoms/SessionNotFound'
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
	// セッションをチェック
	const session = await getSession()
	const isSession = await sessionCheck(session)

	if (isSession === 'profile') {
		await redirectFrom('/user', '/auth/signin')
		return <SessionForbidden />
	} else if (isSession === 'session') {
		await redirectFrom('/auth/signin/setting', '/auth/signin')
		return <SessionForbidden />
	}

	return <PadLockMain />
}

export default Page
