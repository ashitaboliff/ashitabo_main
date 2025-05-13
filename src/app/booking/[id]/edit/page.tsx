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
	const sessionStatus = await sessionCheck(session) // isSession -> sessionStatus

	// sessionStatusが 'profile' でない場合、または session自体がない場合はリダイレクト
	if (sessionStatus !== 'profile' || !session?.user?.id) {
		const redirectPath = `/auth/signin?from=${encodeURIComponent(`/booking/${(await params).id}/edit`)}`
		await redirectFrom(redirectPath, '') // redirectFromの第二引数は空で良いか、あるいはfromの扱いを再考
		// redirectFrom は内部で redirect() を呼ぶため、ここでは何も返さない (nullを返すなど)
		return null
	}
	// ここに来る場合は sessionStatus === 'profile' かつ session.user.id が存在する

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
