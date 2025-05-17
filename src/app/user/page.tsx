'use server'

import { redirectFrom } from '@/app/actions'
import { getSession, sessionCheck } from '@/app/actions'
// import { getProfileAction } from '@/app/actions' // 不要になるため削除
import { getUserRoleAction } from '@/features/admin/components/action'
import { checkGachaCookieAction } from '@/features/gacha/components/actions'
import { getBookingByUserIdAction } from '@/features/booking/components/actions'
import { getGachaByUserIdAction } from '@/features/gacha/components/actions' // Import Gacha action
import type { Profile } from '@/features/user/types'
import type { Booking } from '@/features/booking/types'
import type { GachaData, GachaSort } from '@/features/gacha/types' // Import Gacha types
import UserPage from '@/features/user/components/UserPage'
import { notFound } from 'next/navigation'
import { createMetaData } from '@/utils/metaData'

export async function metadata() {
	return createMetaData({
		title: 'ユーザーページ',
		description: '自分のした予約などを確認できます',
		url: '/user',
	})
}

interface UserPageServerProps {
	searchParams: Promise<{
		// Booking logs params
		page?: string
		limit?: string
		sort?: 'new' | 'old'
		// Gacha logs params
		gachaPage?: string
		gachaLimit?: string
		gachaSort?: GachaSort
	}>
}

const userPage = async ({ searchParams }: UserPageServerProps) => {
	const session = await getSession()
	const sessionStatus = await sessionCheck(session)

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
		const userProfile = session.user.dbProfile as Profile

		// Fetch booking data
		const currentPage = parseInt((await searchParams).page || '1', 10)
		const logsPerPage = parseInt((await searchParams).limit || '10', 10)
		const sort = (await searchParams).sort || 'new'

		let bookings: Booking[] = []
		let totalCount = 0

		const bookingRes = await getBookingByUserIdAction({
			userId: session.user.id,
			sort: sort,
			page: currentPage,
			perPage: logsPerPage,
		})

		if (bookingRes.status === 200) {
			bookings = bookingRes.response.bookings
			totalCount = bookingRes.response.totalCount
		} else {
			// Handle error case, e.g., log it or show a message
			console.error('Failed to fetch bookings:', bookingRes.response)
		}

		const pageMax = Math.ceil(totalCount / logsPerPage) || 1

		// Fetch Gacha logs data
		const gachaCurrentPage = parseInt((await searchParams).gachaPage || '1', 10)
		const gachaLogsPerPage = parseInt(
			(await searchParams).gachaLimit || '15',
			10,
		) // Default to 15 for gacha
		const gachaSort = (await searchParams).gachaSort || 'new'

		let gachas: GachaData[] = []
		let gachaTotalCount = 0

		const gachaRes = await getGachaByUserIdAction({
			userId: session.user.id,
			sort: gachaSort,
			page: gachaCurrentPage,
			perPage: gachaLogsPerPage,
		})

		if (gachaRes.status === 200) {
			gachas = gachaRes.response.gacha
			gachaTotalCount = gachaRes.response.totalCount
		} else {
			console.error('Failed to fetch gacha logs:', gachaRes.response)
		}
		const gachaPageMax = Math.ceil(gachaTotalCount / gachaLogsPerPage) || 1

		return (
			<UserPage
				profile={userProfile}
				session={session}
				userRole={userRole.response}
				gachaStatus={gachaStatus}
				initialBookings={bookings}
				initialPageMax={pageMax}
				initialCurrentPage={currentPage}
				initialLogsPerPage={logsPerPage}
				initialSort={sort}
				initialGachas={gachas}
				initialGachaPageMax={gachaPageMax}
				initialGachaCurrentPage={gachaCurrentPage}
				initialGachaLogsPerPage={gachaLogsPerPage}
				initialGachaSort={gachaSort}
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
