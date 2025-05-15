'use client'

import { useState } from 'react'
import { BookingDetailProps, BookingResponse } from '@/features/booking/types' // Added BookingResponse
import EditAuthPage from '@/features/booking/components/EditAuth'
import EditFormPage from '@/features/booking/components/EditForm'
import { Session } from 'next-auth'

interface EditPageProps {
  bookingDetail: BookingDetailProps;
  session: Session;
  initialBookingResponse: BookingResponse | null;
  initialViewDay: Date;
}

const EditPage = ({
	bookingDetail,
	session,
  initialBookingResponse,
  initialViewDay,
}: EditPageProps) => {
	const [isAuth, setIsAuth] = useState<boolean>(
		bookingDetail.userId === session?.user.id,
	)

	return (
		<div className="flex-col">
			{isAuth ? (
				<EditFormPage
          bookingDetail={bookingDetail}
          session={session}
          initialBookingResponse={initialBookingResponse}
          initialViewDay={initialViewDay}
        />
			) : (
				<EditAuthPage handleSetAuth={setIsAuth} bookingDetail={bookingDetail} />
			)}
		</div>
	)
}

export default EditPage
