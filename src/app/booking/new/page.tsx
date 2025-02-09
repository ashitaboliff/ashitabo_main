'use server'

import NewBooking from '@/components/booking/BookingCreate'
import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
import SessionForbidden from '@/components/atoms/SessionNotFound'
import { createMetaData } from '@/utils/MetaData'

export async function metadata() {
	return createMetaData({
		title: 'コマ表新規予約',
		url: '/booking/new',
	})
}

const Page = async () => {
	const session = await getSession()
	const isSession = await sessionCheck(session)

	if (isSession !== 'profile' || !session) {
		await redirectFrom('/auth/signin', '/booking/new')
		return <SessionForbidden />
	}
	return <NewBooking session={session} />
}

export default Page
