'use server'

import prisma from '@/lib/prisma/prisma'
import { v4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import { Booking, BanBooking } from '@/types/BookingTypes'

/**
 * すべての予約情報を取得する関数
 */
export const getAllBooking = async () => {
	try {
		const bookings = await prisma.booking.findMany({
			select: {
				id: true,
				user_id: true,
				created_at: true,
				updated_at: true,
				booking_date: true,
				booking_time: true,
				regist_name: true,
				name: true,
				is_deleted: true,
			},
		})
		return bookings
	} catch (error) {
		console.error(error)
		throw new Error('Database query failed')
	}
}

/**
 * ある期間の予約情報を取得する関数
 * @param startDate 開始日ISO形式
 * @param endDate 終了日ISO形式
 */
export const getBookingByDate = async ({
	startDate,
	endDate,
}: {
	startDate: string
	endDate: string
}) => {
	try {
		const bookings = await prisma.booking.findMany({
			where: {
				AND: {
					booking_date: {
						gte: startDate,
						lte: endDate,
					},
					is_deleted: {
						not: true,
					},
				},
			},
			select: {
				id: true,
				user_id: true,
				created_at: true,
				updated_at: true,
				booking_date: true,
				booking_time: true,
				regist_name: true,
				name: true,
				is_deleted: true,
			},
			orderBy: [{ booking_date: 'asc' }, { booking_time: 'asc' }],
		})
		return bookings
	} catch (error) {
		console.error(error)
		throw new Error('Database query failed')
	}
}

/**
 * idから予約情報を取得する関数
 * @param id 予約ID
 */
export const getBookingById = async (id: string) => {
	try {
		const booking = await prisma.booking.findFirst({
			where: {
				AND: {
					id: id,
					is_deleted: {
						not: true,
					},
				},
			},
			select: {
				id: true,
				user_id: true,
				created_at: true,
				updated_at: true,
				booking_date: true,
				booking_time: true,
				regist_name: true,
				name: true,
				is_deleted: true,
			},
		})
		return booking
	} catch (error) {
		console.error(error)
		throw new Error('Database query failed')
	}
}

/**
 * 予約情報から予約を取得する関数
 * @param booking 予約情報
 */
export const getBookingByBooking = async ({
	bookingDate,
	bookingTime,
}: {
	bookingDate: string
	bookingTime: number
}) => {
	try {
		const bookingData = await prisma.booking.findFirst({
			where: {
				AND: {
					booking_date: bookingDate,
					booking_time: bookingTime,
					is_deleted: {
						not: true,
					},
				},
			},
		})
		return bookingData
	} catch (error) {
		console.error(error)
		throw new Error('Database query failed')
	}
}

/**
 * 予約情報を作成する関数
 * @param Booking Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'user_id'> 予約情報
 * @param userId ユーザID
 */
export const createBooking = async ({
	booking,
	userId,
}: {
	booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
	userId: string
}) => {
	const atBooking = await getBookingByBooking({
		bookingDate: booking.bookingDate,
		bookingTime: booking.bookingTime,
	})

	if (atBooking) {
		throw new Error('予約が重複しています')
	}

	try {
		await prisma.booking.create({
			data: {
				id: v4(),
				user_id: userId,
				created_at: new Date(),
				booking_date: booking.bookingDate,
				booking_time: booking.bookingTime,
				regist_name: booking.registName,
				name: booking.name,
			},
		})
	} catch (error) {
		console.error(error)
		throw new Error('Database query failed')
	}
}

/**
 * 予約情報を更新する関数
 * @param id 予約ID
 * @param bookingDate 予約日
 * @param bookingTime 予約時間
 * @param registName 登録者名
 * @param name 予約者名
 */
export const updateBooking = async ({
	id,
	bookingDate,
	bookingTime,
	registName,
	name,
}: {
	id: string
	bookingDate: string
	bookingTime: number
	registName: string
	name: string
}) => {
	const atBooking = await getBookingById(id)

	if (!atBooking) {
		throw new Error('指定したIDの予約はありません')
	}

	try {
		await prisma.booking.update({
			where: {
				id: id,
			},
			data: {
				updated_at: new Date(),
				booking_date: bookingDate,
				booking_time: bookingTime,
				regist_name: registName,
				name: name,
			},
		})
	} catch (error) {
		console.error(error)
		throw new Error('Database query failed')
	}
}

/**
 * 予約情報を削除する関数
 * @param id 予約ID
 */
export const deleteBooking = async (id: string) => {
	const atBooking = await getBookingById(id)

	if (!atBooking) {
		throw new Error('指定したIDの予約はありません')
	}

	try {
		await prisma.booking.update({
			where: {
				id: id,
			},
			data: {
				updated_at: new Date(),
				is_deleted: true,
			},
		})
	} catch (error) {
		console.error(error)
		throw new Error('Database query failed')
	}
}

/**
 * 予約禁止日を取得する関数
 * @param startDate 開始日ISO形式
 * @param endDate 終了日ISO形式
 */
export const getBookingBanDate = async ({
	startDate,
	endDate,
}: {
	startDate: string
	endDate: string
}) => {
	try {
		const exBookings = await prisma.exBooking.findMany({
			where: {
				AND: {
					start_date: {
						gte: startDate,
						lte: endDate,
					},
					is_deleted: {
						not: true,
					},
				},
			},
			select: {
				id: true,
				created_at: true,
				updated_at: true,
				start_date: true,
				start_time: true,
				end_time: true,
				description: true,
				is_deleted: true,
			},
			orderBy: [{ start_date: 'asc' }, { start_time: 'asc' }],
		})
		return exBookings as unknown as BanBooking[]
	} catch (error) {
		console.error(error)
		throw new Error('Database query failed')
	}
}

/**
 * 予約可能時間を配列で取得する関数
 */
export const getCalendarTime = async () => {
	const filePath = path.join(process.cwd(), '/src/db/data', 'TimeData.csv')
	try {
		const absolutePath = path.resolve(filePath)
		if (!fs.existsSync(absolutePath)) {
			throw new Error(`File not found: ${filePath}`)
		}
		const data = fs.readFileSync(absolutePath, 'utf-8')
		return data
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line !== '')
	} catch (error) {
		console.error(error)
		throw new Error('Database query failed')
	}
}
