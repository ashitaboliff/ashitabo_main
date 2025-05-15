import React from 'react'
import MainPage from '@/features/booking/components/MainPage'
import { getBookingByDateAction } from '@/features/booking/components/actions'
import { DateToDayISOstring } from '@/utils'
import { addDays, subDays, parseISO } from 'date-fns' // Added parseISO
import { BookingResponse } from '@/features/booking/types'

interface BookingPageProps {
  searchParams?: Promise<{
    viewStartDate?: string;
  }>;
}

const Page = async ({ searchParams }: BookingPageProps) => {
	const viewDayMax = 7
	// Use viewStartDate from searchParams if available, otherwise default to yesterday
	const params = await searchParams;
	const viewStartDate = params?.viewStartDate;
	const initialViewDay = viewStartDate ? parseISO(viewStartDate) : subDays(new Date(), 1);

	const startDate = DateToDayISOstring(initialViewDay).split('T')[0]
	const endDate = DateToDayISOstring(
		addDays(initialViewDay, viewDayMax - 1),
	).split('T')[0]

	let initialBookingData: BookingResponse | undefined = undefined
	let errorStatus: number | undefined = undefined

	const res = await getBookingByDateAction({
		startDate: startDate,
		endDate: endDate,
	})

	if (res.status === 200) {
		initialBookingData = { ...res.response }
	} else {
		// エラーハンドリングはMainPage側で行うため、ここではstatusを記録する程度に留めるか、
		// 必要であればエラーページにリダイレクトするなどの処理を追加
		errorStatus = res.status
		console.error(
			`Error fetching initial booking data: ${res.status} - ${res.response}`,
		)
	}

	return (
		<MainPage
			initialBookingData={initialBookingData}
			initialViewDay={initialViewDay}
			errorStatus={errorStatus}
		/>
	)
}

export default Page
