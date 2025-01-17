'use server'

import BookingDetail from '@/components/booking/BookingDetail'
import BookingDetailNotFound from '@/components/booking/BookingDetailNotFound'
import {
	getCalendarTimeAction,
	getBookingByIdAction,
	getBuyBookingByIdAction,
} from '@/components/booking/actions'
import { BookingDetailProps } from '@/types/BookingTypes'
import { notFound } from 'next/navigation'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	let bookingDetailProps: BookingDetailProps
	const calendarTime = await getCalendarTimeAction()
	if (calendarTime.status !== 200) {
		return notFound()
	}
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
	return (
		<BookingDetail
			calendarTime={calendarTime.response}
			bookingDetail={bookingDetailProps}
		/>
	)
}

export default Page
