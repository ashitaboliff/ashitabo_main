// 'use server' // page.tsx はデフォルトでServer Component

import CreatePage from '@/features/booking/components/Create' // インポート名とパスを変更
import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
import SessionForbidden from '@/components/ui/atoms/SessionNotFound'
import { createMetaData } from '@/utils/MetaData'

export async function metadata() {
	return createMetaData({
		title: 'コマ表新規予約',
		url: '/booking/new',
	})
}

interface PageProps {
	searchParams: { [key: string]: string | string[] | undefined }
}

const Page = async ({ searchParams }: PageProps) => {
	const session = await getSession()
	const isSession = await sessionCheck(session)

	if (isSession !== 'profile' || !session) {
		// redirectFrom はクライアントサイドでのリダイレクトをトリガーする可能性があるため、
		// Server Component での使用は注意が必要。
		// Next.js の redirect 関数 (next/navigation) の使用を検討。
		// ここでは既存の動作を維持。
		await redirectFrom('/auth/signin', '/booking/new')
		return <SessionForbidden />
	}

	const dateParam = searchParams?.date as string | undefined
	const timeParam = searchParams?.time as string | undefined

	return (
		<CreatePage
			session={session}
			initialDateParam={dateParam}
			initialTimeParam={timeParam}
		/>
	)
}

export default Page
