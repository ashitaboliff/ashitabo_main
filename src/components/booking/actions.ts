'use server'

import { ApiResponse, StatusCode } from '@/types/ResponseTypes'
import { eachDayOfInterval, formatISO } from 'date-fns'
import { unstable_cache } from 'next/cache'
import { Booking, BookingResponse, BanBooking } from '@/types/BookingTypes'
import {
	getAllBooking,
	getBookingByDate,
	getBookingById,
	createBooking,
	getBookingByBooking,
	updateBooking,
	deleteBooking,
	getBookingBanDate,
	getCalendarTime,
} from '@/db/Booking'
import { getUser } from '@/db/Auth'

export async function getCalendarTimeAction(): Promise<ApiResponse<string[]>> {
	const calendarTime = unstable_cache(getCalendarTime, [], {
		tags: ['calendarTime'],
	})
	try {
		const timeList = await calendarTime()
		return {
			status: StatusCode.OK,
			response: timeList,
		}
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function getAllBookingAction(): Promise<ApiResponse<Booking[]>> {
	try {
		const revalidateGetAllBooking = unstable_cache(getAllBooking, [], {
			tags: ['getAllBooking'],
		})

		const bookings = await revalidateGetAllBooking()

		const transformedBookings: Booking[] = bookings.map((booking) => ({
			id: booking.id,
			userId: booking.user_id,
			createdAt: booking.created_at,
			updatedAt: booking.updated_at,
			bookingDate: booking.booking_date,
			bookingTime: booking.booking_time,
			registName: booking.regist_name,
			name: booking.name,
			isDeleted: booking.is_deleted,
		}))

		return { status: StatusCode.OK, response: transformedBookings }
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

/**
 * ある日付からある日付までの予約情報と予約禁止情報を取得する関数
 * @param startDate 開始日 (YYYY-MM-DD)
 * @param endDate 終了日 (YYYY-MM-DD)
 * @returns BookingResponse
 */
export async function getBookingByDateAction({
	startDate, // (YYYY-MM-DD)
	endDate, // (YYYY-MM-DD)
}: {
	startDate: string
	endDate: string
}): Promise<ApiResponse<BookingResponse>> {
	try {
		const ISOstartDate = new Date(startDate).toISOString()
		const ISOendDate = new Date(endDate).toISOString()

		const revalidateGetBookingByDate = unstable_cache(
			getBookingByDate,
			['startDate', ISOstartDate, 'endDate', ISOendDate],
			{
				tags: [`getBookingByDate-${ISOstartDate}-${ISOendDate}`],
			},
		)

		const bookings = await revalidateGetBookingByDate({
			startDate: ISOstartDate,
			endDate: ISOendDate,
		})

		const banDates = await getBookingBanDate({
			startDate: ISOstartDate,
			endDate: ISOendDate,
		})

		// 型変換
		const transformedBookings: Booking[] = bookings.map((booking) => ({
			id: booking.id,
			userId: booking.user_id,
			createdAt: booking.created_at,
			updatedAt: booking.updated_at,
			bookingDate: booking.booking_date, // ISO形式
			bookingTime: booking.booking_time,
			registName: booking.regist_name,
			name: booking.name,
			isDeleted: booking.is_deleted,
		}))

		// 指定された期間の全日付を ISO文字列 (YYYY-MM-DD) で生成
		const allDates = eachDayOfInterval({
			start: new Date(startDate),
			end: new Date(endDate),
		}).map((date) => formatISO(date, { representation: 'date' })) // YYYY-MM-DD形式

		// 日付と時間の二次元辞書型配列を初期化
		const bookingsByDateAndTime: BookingResponse = {}

		const calendarTime = await getCalendarTimeAction()

		if (calendarTime.status !== StatusCode.OK) {
			return {
				status: StatusCode.INTERNAL_SERVER_ERROR,
				response: 'Internal Server Error',
			}
		}

		allDates.forEach((date) => {
			bookingsByDateAndTime[date] = {}
			for (let time = 0; time <= calendarTime.response.length; time++) {
				bookingsByDateAndTime[date][time] = null // 初期値はnull
			}
		})

		// 実際の予約データで上書き
		transformedBookings.forEach((booking) => {
			const dateKey = booking.bookingDate.split('T')[0] // ISO文字列から日付部分を抽出
			const timeKey = booking.bookingTime

			if (bookingsByDateAndTime[dateKey]) {
				bookingsByDateAndTime[dateKey][timeKey] = booking
			}
		})

		// 予約禁止データで上書き
		banDates.forEach((banBooking) => {
			const dateKey = banBooking.startDate.split('T')[0]
			const startTime = banBooking.startTime
			const endTime = banBooking.endTime ?? startTime

			for (let time = startTime; time <= endTime; time++) {
				if (
					bookingsByDateAndTime[dateKey] &&
					bookingsByDateAndTime[dateKey][time] === null
				) {
					bookingsByDateAndTime[dateKey][time] = {
						id: banBooking.id,
						userId: 'ForbiddenBooking',
						createdAt: new Date(banBooking.createdAt),
						updatedAt: new Date(banBooking.updatedAt),
						bookingDate: banBooking.startDate,
						bookingTime: time,
						registName: 'ForbiddenBooking',
						name: banBooking.description,
						isDeleted: banBooking.isDeleted,
					}
				}
			}
		})

		return { status: StatusCode.OK, response: bookingsByDateAndTime }
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function getBookingByIdAction(
	bookingId: string,
): Promise<ApiResponse<Booking | string>> {
	try {
		const booking = await getBookingById(bookingId)
		if (!booking)
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このidの予約は存在しません',
			}
		return {
			status: StatusCode.OK,
			response: {
				id: booking.id,
				userId: booking.user_id,
				createdAt: booking.created_at,
				updatedAt: booking.updated_at,
				bookingDate: booking.booking_date,
				bookingTime: booking.booking_time,
				registName: booking.regist_name,
				name: booking.name,
				isDeleted: booking.is_deleted,
			},
		}
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function createBookingAction({
	userId,
	booking,
}: {
	userId: string
	booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
}): Promise<ApiResponse<string>> {
	try {
		const user = await getUser(userId)
		if (!user)
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このユーザーは存在しません',
			}

		const atBooking = await getBookingByBooking({
			bookingDate: booking.bookingDate,
			bookingTime: booking.bookingTime,
		})

		if (atBooking) {
			return {
				status: StatusCode.BAD_REQUEST,
				response: '予約が重複しています',
			}
		}

		await createBooking({ booking, userId })
		return { status: StatusCode.CREATED, response: '予約が完了しました' }
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function updateBookingAction({
	bookingId,
	booking,
	userId,
}: {
	bookingId: string
	booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
	userId: string
}): Promise<ApiResponse<string>> {
	try {
		const atBooking = await getBookingById(bookingId)
		if (!atBooking)
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このidの予約は存在しません',
			}

		const user = await getUser(userId)
		if (!user)
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このユーザーは存在しません',
			}

		if (atBooking.user_id !== userId && atBooking.user_id !== 'admin')
			return {
				status: StatusCode.FORBIDDEN,
				response: '他のユーザーの予約情報は更新できません',
			}

		await updateBooking({
			id: bookingId,
			bookingDate: booking.bookingDate,
			bookingTime: booking.bookingTime,
			registName: booking.registName,
			name: booking.name,
		})
		return { status: StatusCode.OK, response: '予約情報を更新しました' }
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function deleteBookingAction({
	bookingId,
	userId,
}: {
	bookingId: string
	userId: string
}): Promise<ApiResponse<string>> {
	try {
		const atBooking = await getBookingById(bookingId)
		if (!atBooking)
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このidの予約は存在しません',
			}

		const user = await getUser(userId)
		if (!user)
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このユーザーは存在しません',
			}

		if (atBooking.user_id !== userId && atBooking.user_id !== 'admin')
			return {
				status: StatusCode.FORBIDDEN,
				response: '他のユーザーの予約情報は削除できません',
			}

		await deleteBooking(bookingId)
		return { status: StatusCode.OK, response: '予約を削除しました' }
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function deleteBookingByAdminAction( // 要編集
	bookingId: string,
): Promise<ApiResponse<string>> {
	try {
		const atBooking = await getBookingById(bookingId)
		if (!atBooking)
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このidの予約は存在しません',
			}

		await deleteBooking(bookingId)
		return { status: StatusCode.OK, response: '予約を削除しました' }
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function getBookingBanDateAction({
	startDate, // (YYYY-MM-DD)
	endDate, // (YYYY-MM-DD)
}: {
	startDate: string
	endDate: string
}): Promise<ApiResponse<BanBooking[] | string>> {
	try {
		const ISOstartDate = new Date(startDate).toISOString()
		const ISOendDate = new Date(endDate).toISOString()

		const revalidateGetBookingBanDate = unstable_cache(
			getBookingBanDate,
			['startDate', ISOstartDate, 'endDate', ISOendDate],
			{
				tags: [`getBookingBanDate-${ISOstartDate}-${ISOendDate}`],
			},
		)

		const banDates = await revalidateGetBookingBanDate({
			startDate,
			endDate,
		})

		return {
			status: StatusCode.OK,
			response: banDates,
		}
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}
