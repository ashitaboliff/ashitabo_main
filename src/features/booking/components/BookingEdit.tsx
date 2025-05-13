'use client'

import { useState } from 'react'
import { BookingDetailProps } from '@/features/booking/types'
import BookingEditAuth from '@/features/booking/components/BookingEditAuth'
import BookingEditForm from '@/features/booking/components/BookingEditForm'
import { Session } from 'next-auth'

const BookingEdit = ({
	bookingDetail,
	session,
}: {
	bookingDetail: BookingDetailProps
	session: Session
}) => {
	const [isAuth, setIsAuth] = useState<boolean>(
		bookingDetail.userId === session?.user.id,
	)

	return (
		<div className="flex-col">
			{isAuth ? (
				<BookingEditForm bookingDetail={bookingDetail} session={session} />
			) : (
				<BookingEditAuth
					handleSetAuth={setIsAuth}
					bookingDetail={bookingDetail}
				/>
			)}
		</div>
	)
}

export default BookingEdit
