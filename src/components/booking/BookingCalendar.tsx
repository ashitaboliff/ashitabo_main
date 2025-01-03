'use client'

import { BookingResponse } from '@/types/BookingTypes'
import BookingTableBox from '@/components/molecules/BookingTableBox'

const BookingCalendar = (booking_data: BookingResponse) => {
	return (
		<div>
			{booking_data.map((booking) => (
				<BookingTableBox
					key={booking.id}
					booking_date={booking.bookingDate}
					booking_time={booking.bookingTime}
					registName={booking.registName}
					name={booking.name}
					url={booking.url}
				/>
			))}
		</div>
	)
}
