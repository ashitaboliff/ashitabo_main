'use client'

import { useState, useEffect, useRef } from 'react'
import { addDays, subDays, format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { bookingRevalidateTagAction, getBookingByDateAction } from './actions'
import { useScreenSize, getMaxWidth } from '@/utils/ScreenSize'
import { BookingResponse, BookingTime } from '@/features/booking/types'
import { ErrorType } from '@/types/ResponseTypes'
import BookingRule from '@/components/ui/molecules/BookingRule'
import Popup, { PopupRef } from '@/components/ui/molecules/Popup'
import BookingCalendar from '@/features/booking/components/BookingCalendar'
import { DateToDayISOstring } from '@/lib/CommonFunction'

const MainPage = () => {
	const yesterDate = subDays(new Date(), 1)
	const [viewDay, setViewday] = useState<Date>(yesterDate)
	const [viewDayMax, setViewDayMax] = useState<number>(7) // いずれなんとかするかこれ
	const ableViewDayMax = 27 // 連続表示可能な日数
	const ableViewDayMin = 8 // 連続表示可能な最小日数
	const [bookingData, setBookingData] = useState<BookingResponse>()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const ReadMePopupRef = useRef<PopupRef>(undefined)
	const [error, setError] = useState<ErrorType>()
	const [errorPopupOpen, setErrorPopupOpen] = useState<boolean>(false)

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
		setIsLoading(true)
		if (cache === 'no-cache') {
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
			setError({
				status: res.status,
				response: String(res.response),
			})
			setErrorPopupOpen(true)
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
			<div className="flex justify-center space-x-2 mx-2">
				<button
					className="btn btn-blue"
					onClick={async () => {
						getBooking({
							startDate: viewDay,
							endDate: addDays(viewDay, viewDayMax - 1),
							cache: 'no-cache',
						})
						await bookingRevalidateTagAction({ tag: 'banBooking' })
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
				{bookingData ? (
					isLoading ? (
						<div className="flex justify-center">
							<div className="skeleton h-96 w-96"></div>
						</div>
					) : (
						<BookingCalendar bookingDate={bookingData} timeList={BookingTime} />
					)
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
