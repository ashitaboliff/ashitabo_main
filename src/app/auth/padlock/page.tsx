'use server'

import { Suspense } from 'react'
import Loading from '@/components/atoms/Loading'
import AuthPadLock from '@/components/auth/AuthPadLock'
import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
import { padLockCookieAction } from '@/components/auth/actions'

const Page = async () => {
	// セッションをチェック
	const session = await getSession()
	const isSession = await sessionCheck(session)

	if (isSession === 'profile') {
		await redirectFrom('/user', '/auth/padlock')
		return null // リダイレクト後に描画されないよう明示的に null を返す
	}

	// Cookie の状態を確認
	const padlockState = await padLockCookieAction()

	if (padlockState === 'no-cookie' || padlockState === 'locked') {
		// Padlockページを描画
		return (
			<Suspense fallback={<Loading />}>
				<AuthPadLock />
			</Suspense>
		)
	}

	// ログイン画面にリダイレクト
	await redirectFrom('/auth/signin', '/auth/padlock')
	return null // リダイレクト後に描画されないよう null を返す
}

export default Page
