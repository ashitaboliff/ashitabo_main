'use server'

import { BookingDetailProps } from '@/features/booking/types'
import {
	getBookingByIdAction,
	getBuyBookingByUserId,
	updateBookingAction,
} from '@/features/booking/components/actions'
import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
import SessionForbidden from '@/components/ui/atoms/SessionNotFound'
import EditPage from '@/features/booking/components/Edit' // インポート名とパスを変更
import DetailNotFoundPage from '@/features/booking/components/DetailNotFound' // インポート名とパスを変更

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
		return <DetailNotFoundPage />
	}
	if (!bookingDetailProps) {
		return <DetailNotFoundPage />
	}
	return <EditPage bookingDetail={bookingDetailProps} session={session} />
}

export default Page
