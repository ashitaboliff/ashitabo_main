export interface Booking {
	id: string
	userId: string
	createdAt: Date
	updatedAt: Date
	bookingDate: string
	bookingTime: number
	registName: string
	name: string
	isDeleted: boolean
}

export type BanBooking = {
	id: string
	createdAt: string
	updatedAt: string
	startDate: string
	startTime: number
	endTime: number | null
	description: string
	isDeleted: boolean
}

export type BookingResponse = Record<string, Record<number, Booking | null>>

export interface BookingCalenderProps {
	booking_data: Booking[]
}

export interface BookingTableBoxProps {
	booking_date: string
	booking_time: string
	registName?: string | React.ReactNode
	name?: string
	url: string | undefined
}

export interface BookingLog {
	id: string
	created_at: string
	updated_at: string
	booking_date: string
	booking_time: string
	regist_name: string
	name: string
	is_deleted: boolean
}

export const TIME_LIST = [
	'9:00~10:30',
	'10:30~12:00',
	'12:00~13:30',
	'13:30~15:00',
	'15:00~16:30',
	'16:30~18:00',
	'18:00~19:30',
	'19:30~21:00',
]
