'use server'

import DetailPage from '@/features/booking/components/Detail'
import DetailNotFoundPage from '@/features/booking/components/DetailNotFound' // インポート名とパスを変更
import { getBookingByIdAction } from '@/features/booking/components/actions'
import { BookingDetailProps } from '@/features/booking/types'
import { createMetaData } from '@/utils/metaData'

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
		return <DetailNotFoundPage />
	}
	if (!bookingDetailProps) {
		return <DetailNotFoundPage />
	}
	return <DetailPage bookingDetail={bookingDetailProps} />
}

export default Page
