'use client'

import { useRouter } from 'next-nprogress-bar'
import { addWeeks, addDays } from 'date-fns'
import { DateToDayISOstring } from '@/lib/CommonFunction'

import { PiCircle as CircleIcon } from 'react-icons/pi'
import { HiMiniXMark as ForbiddenIcon } from 'react-icons/hi2'

interface BookingTableBoxProps {
	index: string
	id?: string
	bookingDate: string
	bookingTime: number
	registName?: string // registName or ForBidden or undefined
	name?: string // name or description or undefined
}

export const BookingTableBox = ({
	index,
	id,
	bookingDate,
	bookingTime,
	registName,
	name,
}: BookingTableBoxProps) => {
	const router = useRouter()
	const bookingAbleMaxDate = DateToDayISOstring(addWeeks(new Date(), 2))
	const bookingAbleMinDate = DateToDayISOstring(addDays(new Date(), -1))

	const tdClassName =
		bookingDate > bookingAbleMaxDate
			? 'border border-base-200 p-0 bg-base-400'
			: bookingDate < bookingAbleMinDate
				? 'border border-base-200 p-0 bg-base-400'
				: 'border border-base-200 p-0'

	if (registName === undefined) {
		return (
			<td
				key={index}
				className={tdClassName}
				onClick={() => {
					if (
						bookingDate < bookingAbleMinDate ||
						bookingDate > bookingAbleMaxDate
					) {
						return null
					} else {
						router.push(
							`/booking/new?date=${bookingDate.split('T')[0]}&time=${bookingTime}`,
						)
					}
				}}
			>
				<div className="w-11 h-13 flex flex-col justify-center items-center text-center break-words py-1">
					<p className="text-xxxs text-base-content bold">
						<CircleIcon color="blue" size={20} />
					</p>
					<p className="text-xxxs text-base-content"></p>
				</div>
			</td>
		)
	} else if (registName === 'ForbiddenBooking') {
		return (
			<td key={index} className={tdClassName}>
				<div className="w-11 h-13 flex flex-col justify-center items-center text-center break-words py-1">
					<p className="text-xxxs text-base-content bold">
						<ForbiddenIcon color="red" size={20} />
					</p>
					<p className="text-xxxs text-base-content">{name}</p>
				</div>
			</td>
		)
	} else {
		return (
			<td
				key={index}
				className={tdClassName}
				onClick={() => {
					if (bookingDate < bookingAbleMinDate) {
						return null
					} else {
						router.push(`/booking/${id}`)
					}
				}}
			>
				<div className="w-11 h-13 flex flex-col justify-center items-center text-center break-words py-1">
					<p className="text-xxxs text-base-content bold">
						{registName.length > 21
							? registName.slice(0, 20) + '...'
							: registName}
					</p>
					<p className="text-xxxs text-base-content">
						{name && name.length > 14 ? name.slice(0, 13) + '...' : name}
					</p>
				</div>
			</td>
		)
	}
}

export default BookingTableBox
