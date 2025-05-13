'use server'

import BookingDetail from '@/features/booking/components/BookingDetail'
import BookingDetailNotFound from '@/features/booking/components/BookingDetailNotFound'
import { getBookingByIdAction } from '@/features/booking/components/actions'
import { BookingDetailProps } from '@/features/booking/types'
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
	} else {
		return <BookingDetailNotFound />
	}
	if (!bookingDetailProps) {
		return <BookingDetailNotFound />
	}
	return <BookingDetail bookingDetail={bookingDetailProps} />
}

export default Page
