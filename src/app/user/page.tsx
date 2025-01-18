'use server'

import { redirectFrom } from '@/app/actions'
import { getSession, sessionCheck } from '@/app/actions'
import {
	getBookingByUserIdAction,
	getCalendarTimeAction,
} from '@/components/booking/actions'
import { getProfileAction } from '@/app/actions'
import { Profile } from '@/types/UserTypes'
import UserPage from '@/components/user/UserPage'
import { notFound } from 'next/navigation'

const userPage = async () => {
	const session = await getSession()
	const isSession = await sessionCheck(session)
	const calendarTime = await getCalendarTimeAction()
	if (calendarTime.status !== 200) {
		return notFound()
	}
	if (isSession === 'no-session' || !session) {
		await redirectFrom('/auth/signin', '/user')
	} else if (isSession === 'session') {
		await redirectFrom('/auth/signin/setting', '/user')
	} else {
		const profile = await getProfileAction(session.user.id)
		if (profile.status === 200) {
			const booking = await getBookingByUserIdAction(session.user.id)
			if (booking.status !== 200) {
				return notFound()
			} else {
				return (
					<UserPage
						profile={profile.response as Profile}
						session={session}
						bookingDataByUser={booking.response}
						calendarTime={calendarTime.response}
					/>
				)
			}
		} else {
			await redirectFrom('/auth/signin/setting', '/user')
		}
	}
}

export default userPage
