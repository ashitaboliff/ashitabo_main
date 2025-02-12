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
	createdAt: Date
	updatedAt: Date
	startDate: string
	startTime: number
	endTime: number | null
	description: string
	isDeleted: boolean
}

export type BuyBooking = {
	id: string
	bookingId: string
	userId: string
	status: BuyBookingStatus
	createdAt: Date
	updatedAt: Date
	expiredAt: string
	isDeleted: boolean
}

export type BuyBookingStatus = 'PAID' | 'UNPAID' | 'EXPIRED' | 'CANCELED'

export type BuyBookingStatusEnum =
	| '支払済み'
	| '未払い'
	| '支払い期限切れ'
	| 'キャンセル'

export const BuyBookingStatusMap: Record<
	BuyBookingStatus,
	BuyBookingStatusEnum
> = {
	PAID: '支払済み',
	UNPAID: '未払い',
	EXPIRED: '支払い期限切れ',
	CANCELED: 'キャンセル',
}

export type BookingDetailProps = Booking & {
	isPaidStatus?: BuyBookingStatus
	isPaidExpired?: string
}

export type BookingResponse = Record<string, Record<number, Booking | null>>

export interface BookingLog {
	id: string
	userId: string
	createdAt: Date
	updatedAt: Date
	bookingDate: string
	bookingTime: number
	registName: string
	name: string
	isDeleted: boolean
	buyStatus?: BuyBookingStatus
	buyExpiredAt?: string
}

export const BookingTime = [
	'9:00~10:30',
	'10:30~12:00',
	'12:00~13:30',
	'13:30~15:00',
	'15:00~16:30',
	'16:30~18:00',
	'18:00~19:30',
	'19:30~21:00',
]
