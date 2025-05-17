'use client'

import { memo } from 'react'
import { UseFormSetValue } from 'react-hook-form' // Import UseFormSetValue
import { addWeeks, format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { BookingResponse } from '@/features/booking/types'
import BookingTableBox from '@/components/ui/molecules/BookingTableBox'

import { PiCircle as CircleIcon } from 'react-icons/pi'
import { HiMiniXMark as ForbiddenIcon } from 'react-icons/hi2'

/**
 * これは予約カレンダーを描画するためだけのコンポーネント
 * @param booking_date
 * @returns
 */
const EditCalendar = memo(
	({
		bookingResponse,
		timeList,
		actualBookingDate,
		actualBookingTime,
		bookingDate,
		setBookingDate,
		bookingTime,
		setBookingTime,
		setIsPaid,
		setCalendarOpen,
		setValue, // Add setValue to props
	}: {
		bookingResponse: BookingResponse
		timeList: string[] // This is BookingTime array from parent
		actualBookingDate: string
		actualBookingTime: number
		bookingDate: string
		setBookingDate: (bookingDate: string) => void
		bookingTime: number
		setBookingTime: (bookingTime: number) => void
		setIsPaid: (isPaid: boolean) => void
		setCalendarOpen: (calendarOpen: boolean) => void
		setValue: UseFormSetValue<any> // Or a more specific form values type
	}) => {
		const dateList = Object.keys(bookingResponse)
		const bookingAbleMaxDate = addWeeks(new Date(), 2)

		return (
			<div className="flex justify-center">
				<table className="w-auto border border-base-200 table-pin-rows table-pin-cols bg-white">
					<thead>
						<tr>
							<th className="border border-base-200 w-11 sm:w-14 md:w-16"></th>
							{dateList.map((day, index) => {
								return (
									<th
										key={`th-${index}`}
										className="border border-base-200 p-1 sm:p-2 w-11 h-9 sm:w-14 sm:h-12 md:w-16 md:h-14"
									>
										<p className="text-xs-custom sm:text-sm text-base-content">
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
								<td className="border border-base-200 p-1 sm:p-2 w-11 h-13 sm:w-14 sm:h-14 md:w-16 md:h-16 break-words">
									<p className="text-xs-custom sm:text-sm text-base-content break-words">
										{time.split('~')[0]}~ <br /> {time.split('~')[1]}
									</p>
								</td>
								{dateList.map((day, dateIndex) => {
									const booking = bookingResponse[day]?.[timeIndex]
									let tdClassName: string
									if (day === bookingDate && timeIndex === bookingTime) {
										if (new Date(day) > bookingAbleMaxDate) {
											tdClassName =
												'border border-base-200 p-0 bg-primary-light'
										} else {
											tdClassName =
												'border border-base-200 p-0 bg-primary-light'
										}
									} else {
										if (new Date(day) > bookingAbleMaxDate) {
											tdClassName = 'border border-base-200 p-0'
										} else {
											tdClassName = 'border border-base-200 p-0'
										}
									}

									new Date(day) > bookingAbleMaxDate
										? 'border border-base-200 p-0'
										: 'border border-base-200 p-0'

									if (booking?.registName === undefined) {
										return (
											<td
												key={`td-${day}-${timeIndex}`}
												className={tdClassName}
												onClick={() => {
													setBookingDate(day)
													setBookingTime(timeIndex)
													setValue('bookingDate', day)
													setValue('bookingTime', timeList[timeIndex]) // Use timeList which is BookingTime
													setCalendarOpen(false)
													if (new Date(day) > bookingAbleMaxDate) {
														setIsPaid(true)
													} else {
														setIsPaid(false)
													}
												}}
											>
												<div className="w-11 h-13 sm:w-14 sm:h-14 md:w-16 md:h-16 flex flex-col justify-center items-center text-center break-words py-1">
													<p className="text-xxxs sm:text-xs-custom text-base-content bold">
														<CircleIcon color="blue" size={20} />
													</p>
													<p className="text-xxxs sm:text-xs-custom text-base-content"></p>
												</div>
											</td>
										)
									} else if (booking?.registName === 'ForbiddenBooking') {
										return (
											<td
												key={`td-${day}-${timeIndex}`}
												className={tdClassName}
											>
												<div className="w-11 h-13 sm:w-14 sm:h-14 md:w-16 md:h-16 flex flex-col justify-center items-center text-center break-words py-1">
													<p className="text-xxxs sm:text-xs-custom text-base-content bold">
														<ForbiddenIcon color="red" size={20} />
													</p>
												</div>
											</td>
										)
									} else if (
										day === actualBookingDate &&
										timeIndex === actualBookingTime
									) {
										return (
											<td
												key={`td-${day}-${timeIndex}`}
												className={tdClassName}
												onClick={() => {
													setBookingDate(day)
													setBookingTime(timeIndex)
													setValue('bookingDate', day)
													setValue('bookingTime', timeList[timeIndex]) // Use timeList which is BookingTime
													setCalendarOpen(false)
													if (new Date(day) > bookingAbleMaxDate) {
														setIsPaid(true)
													} else {
														setIsPaid(false)
													}
												}}
											>
												<div className="w-11 h-13 sm:w-14 sm:h-14 md:w-16 md:h-16 flex flex-col justify-center items-center text-center break-words py-1">
													<p className="text-xxxs sm:text-xs-custom text-base-content bold">
														{booking?.registName.length > 21
															? booking?.registName.slice(0, 20) + '...'
															: booking?.registName}
													</p>
													<p className="text-xxxs sm:text-xs-custom text-base-content">
														{booking?.name && booking?.name.length > 14
															? booking?.name.slice(0, 13) + '...'
															: booking?.name}
													</p>
												</div>
											</td>
										)
									} else {
										return (
											<td
												key={`td-${day}-${timeIndex}`}
												className={tdClassName}
											>
												<div className="w-11 h-13 sm:w-14 sm:h-14 md:w-16 md:h-16 flex flex-col justify-center items-center text-center break-words py-1">
													<p className="text-xxxs sm:text-xs-custom text-base-content bold">
														<ForbiddenIcon color="red" size={20} />
													</p>
												</div>
											</td>
										)
									}
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		)
	},
)

EditCalendar.displayName = 'EditCalendar'

export default EditCalendar
