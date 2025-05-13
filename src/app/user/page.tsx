'use server'

import { redirectFrom } from '@/app/actions'
import { getSession, sessionCheck } from '@/app/actions'
// import { getProfileAction } from '@/app/actions' // 不要になるため削除
import { getUserRoleAction } from '@/features/admin/components/action'
import { checkGachaCookieAction } from '@/features/gacha/components/actions' // 追加
import type { Profile } from '@/features/user/types' // Profile型はUserPageコンポーネントの型として必要
import UserPage from '@/features/user/components/UserPage'
import { notFound } from 'next/navigation'
import { createMetaData } from '@/utils/MetaData'

export async function metadata() {
	return createMetaData({
		title: 'ユーザーページ',
		description: '自分のした予約などを確認できます',
		url: '/user',
	})
}

const userPage = async () => {
	const session = await getSession()
	const sessionStatus = await sessionCheck(session) // isSession -> sessionStatus に変更

	if (sessionStatus === 'no-session' || !session?.user?.id) {
		// !session もチェック
		await redirectFrom('/auth/signin', '/user')
		return null // redirect後は何もレンダリングしない
	} else if (sessionStatus === 'session') {
		// プロファイルなしセッション
		await redirectFrom('/auth/signin/setting', '/user')
		return null // redirect後は何もレンダリングしない
	} else if (sessionStatus === 'profile' && session.user.dbProfile) {
		// プロファイルありセッション
		const userRole = await getUserRoleAction(session.user.id)
		if (userRole.status !== 200) {
			return notFound()
		}
		// getProfileAction は不要。session.user.dbProfile を直接使用
		const gachaStatus = await checkGachaCookieAction()

		// session.user.dbProfile が Profile 型であることを確認 (型ガードの役割も果たす)
		const userProfile = session.user.dbProfile as Profile // AuthOptionでnullでないことを保証済みと仮定

		return (
			<UserPage
				profile={userProfile}
				session={session}
				userRole={userRole.response}
				gachaStatus={gachaStatus}
			/>
		)
	} else {
		// sessionStatus が 'profile' だが dbProfile がない、または予期せぬ状態
		// この場合は設定ページへリダイレクトするか、エラーページ表示を検討
		await redirectFrom('/auth/signin/setting', '/user?error=profile_not_found')
		return null
	}
}

export default userPage
