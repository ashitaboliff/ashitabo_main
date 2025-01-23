'use client'

import { useState, useEffect, useRef } from 'react'
import { addDays, subDays, format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { bookingRevalidateTagAction, getBookingByDateAction } from './actions'
import { useScreenSize, getMaxWidth } from '@/utils/ScreenSize'
import { BookingResponse } from '@/types/BookingTypes'
import BookingRule from '@/components/molecules/BookingRule'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import Loading from '@/components/atoms/Loading'
import BookingCalendar from '@/components/booking/BookingCalendar'
import { DateToDayISOstring } from '@/lib/CommonFunction'

const MainPage = ({ calendarTime }: { calendarTime: string[] }) => {
	const yesterDate = subDays(new Date(), 1)
	const [viewDay, setViewday] = useState<Date>(yesterDate)
	const [viewDayMax, setViewDayMax] = useState<number>(7) // いずれなんとかするかこれ
	const ableViewDayMax = 27 // 連続表示可能な日数
	const ableViewDayMin = 8 // 連続表示可能な最小日数
	const [bookingData, setBookingData] = useState<BookingResponse>()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const ReadMePopupRef = useRef<PopupRef>(undefined)

	let nextAble =
		addDays(viewDay, viewDayMax) <= addDays(yesterDate, ableViewDayMax)
			? false
			: true
	let prevAble =
		subDays(viewDay, viewDayMax) >= subDays(yesterDate, ableViewDayMin)
			? false
			: true

	const nextWeek = () => {
		setViewday(addDays(viewDay, viewDayMax))
	}

	const prevWeek = () => {
		setViewday(subDays(viewDay, viewDayMax))
	}

	const getBooking = async ({
		startDate, // Date
		endDate, // Date
		cache,
	}: {
		startDate: Date
		endDate: Date
		cache?: 'no-cache'
	}) => {
		if (cache === 'no-cache') {
			setIsLoading(true)
			await bookingRevalidateTagAction({ tag: 'booking' })
		}
		const startDay = DateToDayISOstring(startDate).split('T')[0]
		const endDay = DateToDayISOstring(endDate).split('T')[0]
		const res = await getBookingByDateAction({
			startDate: startDay,
			endDate: endDay,
		})
		if (res.status === 200) {
			setBookingData({ ...res.response })
		} else {
			console.error('Failed to get booking data')
			return null
		}
		setIsLoading(false)
	}

	useEffect(() => {
		getBooking({
			startDate: viewDay,
			endDate: addDays(viewDay, viewDayMax - 1),
		})
		// eslint-disable-next-line react-hooks/rules-of-hooks
	}, [viewDay])

	return (
		<div>
			<div className="flex justify-center space-x-2 m-2">
				<button
					className="btn btn-primary"
					onClick={() =>
						getBooking({
							startDate: viewDay,
							endDate: addDays(viewDay, viewDayMax - 1),
							cache: 'no-cache',
						})
					}
				>
					カレンダーを更新
				</button>
				<button
					className="btn btn-outline btn-primary"
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
				{bookingData ? (
					<BookingCalendar bookingDate={bookingData} timeList={calendarTime} />
				) : (
					<div className="flex justify-center">
						<div className="skeleton h-96 w-96"></div>
					</div>
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
		</div>
	)
}

export default MainPage
