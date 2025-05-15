'use server'

import { BookingDetailProps, BookingResponse } from '@/features/booking/types' // Added BookingResponse
import {
	getBookingByIdAction,
	getBuyBookingByUserId,
	updateBookingAction,
  getBookingByDateAction, // Added for calendar data
} from '@/features/booking/components/actions'
import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
import SessionForbidden from '@/components/ui/atoms/SessionNotFound'
import EditPage from '@/features/booking/components/Edit'
import DetailNotFoundPage from '@/features/booking/components/DetailNotFound'
import { DateToDayISOstring } from '@/utils' // Added for date formatting
import { addDays, subDays, parseISO } from 'date-fns' // Added for date manipulation

export async function metadata() {
	return {
		title: 'あしたぼコマ表予約編集',
		description: `あしたぼコマ表の予約編集です。`,
		url: `/booking/id/edit`,
	}
}

interface EditBookingPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    viewStartDate?: string;
  }>;
}

const Page = async ({ params, searchParams }: EditBookingPageProps) => {
	const session = await getSession()
	const sessionStatus = await sessionCheck(session)

	// sessionStatusが 'profile' でない場合、または session自体がない場合はリダイレクト
	if (sessionStatus !== 'profile' || !session?.user?.id) {
		const redirectPath = `/auth/signin?from=${encodeURIComponent(`/booking/${(await params).id}/edit`)}`
		await redirectFrom(redirectPath, '') // redirectFromの第二引数は空で良いか、あるいはfromの扱いを再考
		// redirectFrom は内部で redirect() を呼ぶため、ここでは何も返さない (nullを返すなど)
		return null
	}
	// ここに来る場合は sessionStatus === 'profile' かつ session.user.id が存在する

	let bookingDetailProps: BookingDetailProps
	const id = (await params).id; // No need for await if params is not a Promise
	const bookingDetailResult = await getBookingByIdAction(id)

	if (bookingDetailResult.status === 200) {
		bookingDetailProps = bookingDetailResult.response
	} else {
		return <DetailNotFoundPage />
	}
	if (!bookingDetailProps) { // Should be redundant if previous check passes
		return <DetailNotFoundPage />
	}

  // Fetch calendar data based on viewStartDate
  const viewDayMax = 7; // Assuming 7 days view
  const viewStartDate = (await searchParams).viewStartDate;
  const initialViewDayDate = viewStartDate ? parseISO(viewStartDate) : subDays(new Date(), 1);

  const calendarStartDate = DateToDayISOstring(initialViewDayDate).split('T')[0];
  const calendarEndDate = DateToDayISOstring(addDays(initialViewDayDate, viewDayMax - 1)).split('T')[0];

  let initialBookingResponse: BookingResponse | null = null;
  const calendarBookingRes = await getBookingByDateAction({
    startDate: calendarStartDate,
    endDate: calendarEndDate,
  });

  if (calendarBookingRes.status === 200) {
    initialBookingResponse = calendarBookingRes.response;
  } else {
    console.error('Failed to get calendar booking data for edit page');
    // Decide if this is a critical error or if the page can render without it
  }

	return (
    <EditPage
      bookingDetail={bookingDetailProps}
      session={session}
      initialBookingResponse={initialBookingResponse}
      initialViewDay={initialViewDayDate}
    />
  )
}

export default Page
