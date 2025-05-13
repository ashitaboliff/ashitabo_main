'use server'

import { BookingDetailProps } from '@/types/BookingTypes'
import {
	getBookingByIdAction,
	getBuyBookingByUserId,
	updateBookingAction,
} from '@/features/booking/components/actions'
import { getSession, sessionCheck, redirectFrom } from '@/app/actions' // Added getSession, sessionCheck
import SessionForbidden from '@/components/ui/atoms/SessionNotFound'
import BookingEdit from '@/features/booking/components/BookingEdit' // Corrected path
import BookingDetailNotFound from '@/features/booking/components/BookingDetailNotFound' // Corrected path

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
	} else {
		return <BookingDetailNotFound />
	}
	if (!bookingDetailProps) {
		return <BookingDetailNotFound />
	}
	return <BookingEdit bookingDetail={bookingDetailProps} session={session} />
}

export default Page
