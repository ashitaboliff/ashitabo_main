'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter as useNProgressRouter } from 'next-nprogress-bar' // Aliased for clarity
import { usePathname, useSearchParams } from 'next/navigation' // Import for path and search params
import { addDays, subDays, format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { bookingRevalidateTagAction } from './actions' // getBookingByDateAction will be used by parent
import { BookingResponse, BookingTime } from '@/features/booking/types'
import { ErrorType } from '@/utils/types/responseTypes'
import BookingRule from '@/components/ui/molecules/BookingRule'
import Popup, { PopupRef } from '@/components/ui/molecules/Popup'
import BookingCalendar from '@/features/booking/components/BookingCalendar'
import { DateToDayISOstring } from '@/utils'

interface MainPageProps {
	initialBookingData?: BookingResponse
	initialViewDay: Date
	errorStatus?: number
}

const MainPage = ({
	initialBookingData,
	initialViewDay,
	errorStatus,
}: MainPageProps) => {
	const router = useNProgressRouter() // Use aliased router
	const pathname = usePathname() // Get current pathname
	const currentSearchParams = useSearchParams() // Get current search params

	const [viewDay, setViewDay] = useState<Date>(initialViewDay)
	const [viewDayMax, setViewDayMax] = useState<number>(7)
	const ableViewDayMax = 27
	const ableViewDayMin = 8
	// bookingData is now directly from props: initialBookingData
	const bookingData = initialBookingData;
	const [isLoading, setIsLoading] = useState<boolean>(false) // This might be removed if parent handles loading via Suspense
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const ReadMePopupRef = useRef<PopupRef>(undefined)
	const [error, setError] = useState<ErrorType | undefined>(
		errorStatus
			? { status: errorStatus, response: '初期データの取得に失敗しました。' }
			: undefined,
	)
	const [errorPopupOpen, setErrorPopupOpen] = useState<boolean>(!!errorStatus)

	// yesterDate を initialViewDay を元に再計算するか、propsで渡されたものを基準にする
	const componentBaseDate = initialViewDay

	const updateViewDayInUrl = (newViewDay: Date) => {
    const newViewStartDate = DateToDayISOstring(newViewDay).split('T')[0];
    // Assuming the current path is /booking
    router.push(`/booking?viewStartDate=${newViewStartDate}`, { scroll: false });
    setViewDay(newViewDay);
  };

	let nextAble =
		addDays(viewDay, viewDayMax) <= addDays(componentBaseDate, ableViewDayMax)
			? false
			: true
	let prevAble =
		subDays(viewDay, viewDayMax) >= subDays(componentBaseDate, ableViewDayMin)
			? false
			: true

	const nextWeek = () => {
		const newViewDay = addDays(viewDay, viewDayMax);
    updateViewDayInUrl(newViewDay);
	}

	const prevWeek = () => {
		const newViewDay = subDays(viewDay, viewDayMax);
    updateViewDayInUrl(newViewDay);
	}

	// getBooking function and its useEffect are removed. Data is fetched by parent.

	useEffect(() => {
		if (errorStatus && !initialBookingData) { // Check against initialBookingData
			setError({
				status: errorStatus,
				response:
					'初期データの取得に失敗しました。画面を更新するか、時間をおいて再度お試しください。',
			})
			setErrorPopupOpen(true)
		}
	}, [errorStatus, initialBookingData]) // Dependency updated

	return (
		<div>
			<div className="flex justify-center space-x-2 mx-2">
				<button
					className="btn btn-blue"
					onClick={async () => {
            // This button now only needs to revalidate, data fetching is via URL change
            setIsLoading(true); // Show loading for revalidation
						await bookingRevalidateTagAction({ tag: 'booking' }); // Revalidate booking data
						await bookingRevalidateTagAction({ tag: 'banBooking' });
            // Force re-fetch by navigating to the current URL (or a slightly modified one if needed to trigger RSC)
            // For simplicity, we can rely on parent re-fetching due to revalidation if data sources are shared,
            // or explicitly trigger a navigation to current path to force RSC refresh.
            // router.push(router.asPath, { scroll: false }); // This might be needed if revalidation alone isn't enough
            // For now, let's assume revalidation is sufficient or parent handles refresh.
            // If direct refresh is needed to reflect revalidated data:
            const newSearchParams = new URLSearchParams(Array.from(currentSearchParams.entries()));
            // Optionally add a cache-busting param if needed, though revalidateTag should handle server-side cache
            // newSearchParams.set('_t', Date.now().toString());
            router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
            setIsLoading(false);
					}}
				>
					コマ表を更新
				</button>
				<button
					className="btn btn-outline btn-tetiary"
					onClick={() => setIsPopupOpen(true)}
				>
					使い方の表示
				</button>
			</div>
			<div className="flex flex-col justify-center space-x-2">
				<div className="flex justify-between items-center mb-4 m-auto">
					<button
						className="btn btn-outline"
						onClick={prevWeek}
						disabled={prevAble}
					>
						{'<'}
					</button>
					<div className="text-lg font-bold mx-2 w-72 text-center">
						{format(viewDay, 'M/d(E)', { locale: ja })}~
						{format(addDays(viewDay, viewDayMax - 1), 'M/d(E)', { locale: ja })}
						までのコマ表
					</div>
					<button
						className="btn btn-outline"
						onClick={nextWeek}
						disabled={nextAble}
					>
						{'>'}
					</button>
				</div>
				{isLoading || !bookingData ? (
					<div className="flex justify-center">
						<div className="skeleton w-[360px] h-[400px] sm:w-[520px] sm:h-[580px]"></div>
					</div>
				) : (
					<BookingCalendar bookingDate={bookingData} timeList={BookingTime} />
				)}
			</div>
			<Popup
				ref={ReadMePopupRef}
				title="使い方"
				maxWidth="sm"
				open={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
			>
				<BookingRule />
				<div className="flex justify-center space-x-2">
					<button
						type="button"
						className="btn btn-outline"
						onClick={() => setIsPopupOpen(false)}
					>
						閉じる
					</button>
				</div>
			</Popup>
			<Popup
				title="エラー"
				maxWidth="sm"
				open={errorPopupOpen}
				onClose={() => setErrorPopupOpen(false)}
			>
				<div className="flex flex-col items-center space-y-4">
					<div className="text-error text-lg font-bold">
						{error?.status}{' '}
						エラーが発生しました。このエラーが何度も発生する場合は、管理者にお問い合わせください。
					</div>
					<div className="flex justify-center space-x-2">
						<button
							type="button"
							className="btn btn-outline"
							onClick={() => setErrorPopupOpen(false)}
						>
							閉じる
						</button>
					</div>
				</div>
			</Popup>
		</div>
	)
}

export default MainPage
