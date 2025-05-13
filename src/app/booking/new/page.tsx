// 'use server' // page.tsx はデフォルトでServer Component

import CreatePage from '@/features/booking/components/Create' // インポート名とパスを変更
import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
import SessionForbidden from '@/components/ui/atoms/SessionNotFound'
import { createMetaData } from '@/utils/metaData'

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
	const sessionStatus = await sessionCheck(session) // isSession -> sessionStatus

	// sessionStatusが 'profile' でない場合、または session自体がない場合はリダイレクト
	if (sessionStatus !== 'profile' || !session?.user?.id) {
		const redirectPath = `/auth/signin?from=${encodeURIComponent('/booking/new')}`
		await redirectFrom(redirectPath, '') // redirectFromの第二引数は空で良いか、あるいはfromの扱いを再考
		return null // redirect後は何もレンダリングしない
	}
	// ここに来る場合は sessionStatus === 'profile' かつ session.user.id が存在する

	const { date, time } = await searchParams

	const dateParam = date as string | undefined
	const timeParam = time as string | undefined

	return (
		<CreatePage
			session={session}
			initialDateParam={dateParam}
			initialTimeParam={timeParam}
		/>
	)
}

export default Page
