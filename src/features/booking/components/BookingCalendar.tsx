'use client'

import { memo } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { BookingResponse } from '../types'
import BookingTableBox from '@/components/molecules/BookingTableBox'

/**
 * これは予約カレンダーを描画するためだけのコンポーネント
 * @param booking_date
 * @returns
 */
const BookingCalendar = memo(
	({
		bookingDate,
		timeList,
	}: {
		bookingDate: BookingResponse
		timeList: string[]
	}) => {
		const dateList = Object.keys(bookingDate)

		return (
			<div className="flex justify-center">
				<table className="w-auto border border-base-200 table-pin-rows table-pin-cols bg-bg-white">
					<thead>
						<tr>
							<th className="border border-base-200 w-11"></th>
							{dateList.map((day, index) => {
								return (
									<th
										key={`th-${index}`}
										className="border border-base-200 p-1 w-11 h-9"
									>
										<p className="text-xs text-base-content">
											{format(new Date(day), 'MM/dd', { locale: ja })} <br />{' '}
											{format(new Date(day), '(E)', { locale: ja })}
										</p>
									</th>
								)
							})}
						</tr>
					</thead>
					<tbody>
						{timeList.map((time, timeIndex) => (
							<tr key={`tr-${time}`}>
								<td className="border border-base-200 p-1 w-11 h-13 break-words">
									<p className="text-xs text-base-content break-words">
										{time.split('~')[0]}~ <br /> {time.split('~')[1]}
									</p>
								</td>
								{dateList.map((day, dateIndex) => {
									const booking = bookingDate[day]?.[timeIndex]
									return (
										<BookingTableBox
											key={`td-${day}-${timeIndex}`}
											index={`booking-${day}-${timeIndex}`}
											id={booking?.id}
											bookingDate={day}
											bookingTime={timeIndex}
											registName={booking?.registName}
											name={booking?.name}
										/>
									)
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		)
	},
)

BookingCalendar.displayName = 'BookingCalendar'

export default BookingCalendar
