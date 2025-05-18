'use server'

import { redirectFrom } from '@/app/actions'
import { getSession, sessionCheck } from '@/app/actions'
// import { getProfileAction } from '@/app/actions' // 不要になるため削除
import type { Profile } from '@/features/user/types' // Profile型はProfileEditコンポーネントの型として必要
import ProfileEdit from '@/features/user/components/ProfileEdit'

export async function metadata() {
	return {
		title: 'プロフィール編集',
		description: 'プロフィールを編集します',
		url: '/user/edit',
	}
}

const userPage = async () => {
	const session = await getSession()
	const sessionStatus = await sessionCheck(session) // isSession -> sessionStatus に変更

	if (sessionStatus === 'no-session' || !session?.user?.id) {
		// !session もチェック
		await redirectFrom('/auth/signin', '/user/edit')
		return null // redirect後は何もレンダリングしない
	} else if (sessionStatus === 'session') {
		// プロファイルなしセッション
		await redirectFrom('/auth/signin/setting', '/user/edit')
		return null // redirect後は何もレンダリングしない
	} else if (sessionStatus === 'profile' && session.user.dbProfile) {
		// プロファイルありセッション
		// getProfileAction は不要。session.user.dbProfile を直接使用
		const userProfile = session.user.dbProfile as Profile // AuthOptionでnullでないことを保証済みと仮定
		return <ProfileEdit profile={userProfile} />
	} else {
		// sessionStatus が 'profile' だが dbProfile がない、または予期せぬ状態
		// この場合は設定ページへリダイレクトするか、エラーページ表示を検討
		await redirectFrom(
			'/auth/signin/setting',
			'/user/edit?error=profile_not_found',
		)
		return null
	}
}

export default userPage
