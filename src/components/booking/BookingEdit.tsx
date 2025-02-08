'use client'

import { useState } from 'react'
import { BookingDetailProps } from '@/types/BookingTypes'
import BookingEditAuth from '@/components/booking/BookingEditAuth'
import BookingEditForm from '@/components/booking/BookingEditForm'
import { Session } from 'next-auth'

const BookingEdit = ({
	calendarTime,
	bookingDetail,
	session,
}: {
	calendarTime: string[]
	bookingDetail: BookingDetailProps
	session: Session
}) => {
	const [isAuth, setIsAuth] = useState<boolean>(
		bookingDetail.userId === session?.user.id,
	)

	return (
		<div className="flex-col">
			{isAuth ? (
				<BookingEditForm
					calendarTime={calendarTime}
					bookingDetail={bookingDetail}
					session={session}
				/>
			) : (
				<BookingEditAuth
					handleSetAuth={setIsAuth}
					calendarTime={calendarTime}
					bookingDetail={bookingDetail}
				/>
			)}
		</div>
	)
}

export default BookingEdit
