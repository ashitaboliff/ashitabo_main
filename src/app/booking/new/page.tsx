'use client'

import React, { Suspense } from 'react'
import NewBooking from '@/components/booking/BookingCreate'
import Loading from '@/components/atoms/Loading'

const Page = () => {
	return (
		<Suspense fallback={<Loading />}>
			<NewBooking />
		</Suspense>
	)
}

export default Page
