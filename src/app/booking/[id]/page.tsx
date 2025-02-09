'use server'

import BookingDetail from '@/components/booking/BookingDetail'
import BookingDetailNotFound from '@/components/booking/BookingDetailNotFound'
import {
	getBookingByIdAction,
	getBuyBookingByIdAction,
} from '@/components/booking/actions'
import { BookingDetailProps } from '@/types/BookingTypes'
import { createMetaData } from '@/utils/MetaData'

export async function metadata() {
	return createMetaData({
		title: 'あしたぼコマ表予約詳細',
		description: `あしたぼコマ表の予約詳細です。`,
		url: `/booking/id`,
	})
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
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
	return <BookingDetail bookingDetail={bookingDetailProps} />
}

export default Page
