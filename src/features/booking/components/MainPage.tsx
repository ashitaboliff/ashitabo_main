'use client'

import { useState, useEffect, useRef } from 'react'
import { addDays, subDays, format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { bookingRevalidateTagAction, getBookingByDateAction } from './actions'
import { BookingResponse, BookingTime } from '@/features/booking/types'
import { ErrorType } from '@/types/ResponseTypes'
import BookingRule from '@/components/ui/molecules/BookingRule'
import Popup, { PopupRef } from '@/components/ui/molecules/Popup'
import BookingCalendar from '@/features/booking/components/BookingCalendar'
import { DateToDayISOstring } from '@/lib/CommonFunction'

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
	const [viewDay, setViewday] = useState<Date>(initialViewDay)
	const [viewDayMax, setViewDayMax] = useState<number>(7) // いずれなんとかするかこれ
	const ableViewDayMax = 27 // 連続表示可能な日数
	const ableViewDayMin = 8 // 連続表示可能な最小日数
	const [bookingData, setBookingData] =
		useState<BookingResponse | undefined>(initialBookingData)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const ReadMePopupRef = useRef<PopupRef>(undefined)
	const [error, setError] = useState<ErrorType | undefined>(
		errorStatus ? { status: errorStatus, response: '初期データの取得に失敗しました。' } : undefined
	)
	const [errorPopupOpen, setErrorPopupOpen] = useState<boolean>(!!errorStatus)

	// yesterDate を initialViewDay を元に再計算するか、propsで渡されたものを基準にする
	const componentBaseDate = initialViewDay // もしyesterDate相当のものを動的にしたい場合は調整

	let nextAble =
		addDays(viewDay, viewDayMax) <= addDays(componentBaseDate, ableViewDayMax)
			? false
			: true
	let prevAble =
		subDays(viewDay, viewDayMax) >= subDays(componentBaseDate, ableViewDayMin)
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
		// initialBookingData があり、かつ viewDay が initialViewDay の場合はAPI呼び出しをスキップ
		// ただし、viewDayMaxが変更された場合は再取得が必要なので、この条件分岐は単純ではない
		// ここでは、viewDayまたはviewDayMaxが変更されたら常にAPIを叩く方針を維持
		// ただし、initialBookingDataがない場合（エラー時など）や、
		// viewDayがinitialViewDayと異なる場合にのみ setIsLoading(true) から始める
		if (!initialBookingData || viewDay !== initialViewDay) {
			getBooking({
				startDate: viewDay,
				endDate: addDays(viewDay, viewDayMax - 1),
			})
		} else if (initialBookingData && bookingData !== initialBookingData) {
      // propsで渡されたデータと現在のデータが異なる場合（例：親が更新した）、更新する
      // ただし、これは無限ループのリスクもあるため、慎重な設計が必要
      // 今回は、propsからの初期値設定に留め、以降はクライアントの状態を正とする
    }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [viewDay, viewDayMax]) // initialBookingData, initialViewDay は依存配列に含めない

	// 初期エラーがある場合、useEffectでエラーポップアップを開く
	useEffect(() => {
		if (errorStatus && !bookingData) { // bookingDataがない（初期取得失敗）場合のみ
			setError({ status: errorStatus, response: '初期データの取得に失敗しました。画面を更新するか、時間をおいて再度お試しください。'})
			setErrorPopupOpen(true)
		}
	}, [errorStatus, bookingData])


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
