'use server'

import { BookingDetailProps } from '@/types/BookingTypes'
import {
	getBookingByIdAction,
	getBuyBookingByIdAction,
} from '@/components/booking/actions'
import { redirectFrom } from '@/app/actions'
import { getSession, sessionCheck } from '@/app/actions'
import SessionForbidden from '@/components/atoms/SessionNotFound'
import BookingEdit from '@/components/booking/BookingEdit'
import BookingDetailNotFound from '@/components/booking/BookingDetailNotFound'

export async function metadata() {
	return {
		title: 'あしたぼコマ表予約編集',
		description: `あしたぼコマ表の予約編集です。`,
		url: `/booking/id/edit`,
	}
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const session = await getSession()
	const isSession = await sessionCheck(session)

	if (!session || isSession !== 'profile') {
		await redirectFrom('/auth/signin', `/booking/${(await params).id}/edit`)
		return <SessionForbidden />
	}
	let bookingDetailProps: BookingDetailProps

	const id = (await params).id
	const bookingDetail = await getBookingByIdAction(id)
	if (bookingDetail.status === 200) {
		bookingDetailProps = bookingDetail.response
		const isBuyBooking = await getBuyBookingByIdAction(id)
		if (isBuyBooking.status === 200) {
			bookingDetailProps.isPaidStatus = isBuyBooking.response.status
			bookingDetailProps.isPaidExpired = isBuyBooking.response.expiredAt
		}
	} else {
		return <BookingDetailNotFound />
	}
	if (!bookingDetailProps) {
		return <BookingDetailNotFound />
	}
	return <BookingEdit bookingDetail={bookingDetailProps} session={session} />
}

export default Page
