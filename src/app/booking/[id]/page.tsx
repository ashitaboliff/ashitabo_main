'use server'

import DetailPage from '@/features/booking/components/Detail'
import DetailNotFoundPage from '@/features/booking/components/DetailNotFound'
import { getBookingByIdAction } from '@/features/booking/components/actions'
import { BookingDetailProps, BookingTime } from '@/features/booking/types'
import { createMetaData } from '@/utils/metaData'
import { Metadata, ResolvingMetadata } from 'next'

type Props = {
	params: Promise<{ id: string }>
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const { id } = await params
	const bookingDetail = await getBookingByIdAction(id)

	let title = `予約詳細 ${id}`
	let description = `あしたぼコマ表の予約詳細 (${id}) です。`

	if (bookingDetail.status === 200 && bookingDetail.response) {
		const bookingData = bookingDetail.response as BookingDetailProps
		title = bookingData.registName
			? `${bookingData.registName}の予約 | 予約詳細`
			: `予約詳細 ${id}`
		description = `あしたぼコマ表の予約 (${bookingData.registName || id}、${bookingData.bookingDate} ${BookingTime[bookingData.bookingTime] || ''}) の詳細です。`
	}

	return createMetaData({
		title,
		description,
		pathname: `/booking/${id}`,
	})
}

const Page = async ({ params }: Props) => {
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
