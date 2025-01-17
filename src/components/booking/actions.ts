'use server'

import { ApiResponse, StatusCode } from '@/types/ResponseTypes'
import { revalidateTag } from 'next/cache'
import { eachDayOfInterval, formatISO } from 'date-fns'
import { hashSync, compareSync } from 'bcryptjs'
import {
	Booking,
	BookingResponse,
	BanBooking,
	BuyBooking,
	BuyBookingStatus,
	BookingLog,
	BookingDetailProps,
} from '@/types/BookingTypes'
import {
	getAllBooking,
	getAllBuyBooking,
	getBookingByDate,
	getBookingById,
	createBooking,
	getBookingByBooking,
	getBookingByUserIdAndDate,
	getBookingByUserId,
	checkBookingPassword,
	updateBooking,
	deleteBooking,
	getBookingBanDate,
	getCalendarTime,
	getBuyBookingById,
	getBuyBookingByUserId,
	updateBuyBooking,
} from '@/db/Booking'
import { getUser } from '@/db/Auth'
import { cookies } from 'next/headers'

export async function getCalendarTimeAction(): Promise<ApiResponse<string[]>> {
	try {
		const timeList = await getCalendarTime()
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

export async function getAllBookingAction(): Promise<
	ApiResponse<BookingLog[]>
> {
	try {
		const bookings = await getAllBooking()

		const transformedBookings: BookingLog[] = bookings.map((booking) => ({
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

		const buyBookings = await getAllBuyBooking()

		const transformedBuyBookings: BuyBooking[] = buyBookings.map(
			(buyBooking) => ({
				id: buyBooking.id,
				booking_id: buyBooking.booking_id,
				userId: buyBooking.user_id,
				status: buyBooking.status,
				createdAt: buyBooking.created_at,
				updatedAt: buyBooking.updated_at,
				expiredAt: buyBooking.expire_at,
				isDeleted: buyBooking.is_deleted,
			}),
		)

		// 予約情報と購入情報を結合
		transformedBookings.forEach((booking) => {
			const buyBooking = transformedBuyBookings.find(
				(buyBooking) => buyBooking.booking_id === booking.id,
			)
			if (buyBooking) {
				booking.buyStatus = buyBooking.status
				booking.buyExpiredAt = buyBooking.expiredAt
			}
		})

		return { status: StatusCode.OK, response: transformedBookings }
	} catch (error) {
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

		const bookings = await getBookingByDate({
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
		const transformedBanBookings: BanBooking[] = banDates.map((banBooking) => ({
			id: banBooking.id,
			createdAt: banBooking.created_at,
			updatedAt: banBooking.updated_at,
			startDate: banBooking.start_date,
			startTime: banBooking.start_time,
			endTime: banBooking.end_time,
			description: banBooking.description,
			isDeleted: banBooking.is_deleted,
		}))

		// 予約禁止データで上書き
		transformedBanBookings.forEach((banBooking) => {
			const dateKey: string = banBooking.startDate.split('T')[0]
			const startTime: number = banBooking.startTime
			const endTime: number = banBooking.endTime ?? startTime

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
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function getBookingByIdAction(
	bookingId: string,
): Promise<ApiResponse<Booking>> {
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
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export const getBookingByUserIdAction = async (
	userId: string,
): Promise<ApiResponse<BookingDetailProps[]>> => {
	try {
		const bookings = await getBookingByUserId(userId)

		const transformedBookings: BookingDetailProps[] = bookings.map(
			(booking) => ({
				id: booking.id,
				userId: booking.user_id,
				createdAt: booking.created_at,
				updatedAt: booking.updated_at,
				bookingDate: booking.booking_date,
				bookingTime: booking.booking_time,
				registName: booking.regist_name,
				name: booking.name,
				isDeleted: booking.is_deleted,
			}),
		)

		const buyBookings = await getBuyBookingByUserId(userId)

		const transformedBuyBookings: BuyBooking[] = buyBookings.map(
			(buyBooking) => ({
				id: buyBooking.id,
				booking_id: buyBooking.booking_id,
				userId: buyBooking.user_id,
				status: buyBooking.status,
				createdAt: buyBooking.created_at,
				updatedAt: buyBooking.updated_at,
				expiredAt: buyBooking.expire_at,
				isDeleted: buyBooking.is_deleted,
			}),
		)

		transformedBookings.forEach((booking) => {
			const buyBooking = transformedBuyBookings.find(
				(buyBooking) => buyBooking.booking_id === booking.id,
			)
			if (buyBooking) {
				booking.isPaidStatus = buyBooking.status
				booking.isPaidExpired = buyBooking.expiredAt
			}
		})

		return { status: StatusCode.OK, response: transformedBookings }
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function createBookingAction({
	userId,
	booking,
	isPaid,
	isPaidExpired,
	password,
	toDay,
	isPaidBookingDateMin,
}: {
	userId: string
	booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
	isPaid: boolean
	isPaidExpired?: string
	password: string
	toDay: string
	isPaidBookingDateMin: string
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
				status: StatusCode.CONFLICT,
				response: '予約が重複しています',
			}
		}

		if (new Date(booking.bookingDate) < new Date(toDay))
			return {
				status: StatusCode.BAD_REQUEST,
				response: '過去の日付は予約できません',
			}

		if (!isPaid) {
			const sameUserBooking = await getBookingByUserIdAndDate({
				userId,
				startDate: toDay,
				endDate: isPaidBookingDateMin,
			})
			if (sameUserBooking.length > 5) {
				return {
					status: StatusCode.FORBIDDEN,
					response: '同一ユーザの無料予約は4件までです。',
				}
			}
		}

		const hashedPassword = hashSync(password, 10)

		await createBooking({
			booking,
			userId,
			isPaid,
			isPaidExpired,
			password: hashedPassword,
		})

		revalidateTag('booking')

		return { status: StatusCode.CREATED, response: '予約が完了しました' }
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: `error: ${error}`,
		}
	}
}

export async function authBookingAction({
	bookingId,
	password,
}: {
	bookingId: string
	password: string
}): Promise<ApiResponse<string>> {
	const oneDay = 60 * 60 * 24
	const cookieStore = await cookies()
	const PassFailCount = Number(
		cookieStore.get(`PassFailCount-${bookingId}`)?.value ?? 0,
	)

	try {
		const bookingPassword = await checkBookingPassword({ bookingId })
		if (!bookingPassword)
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このidの予約は存在しません',
			}

		const isCorrect = compareSync(password, bookingPassword)
		if (!isCorrect)
			if (PassFailCount >= 5) {
				cookieStore.set(`PassFailCount-${bookingId}`, '0', { maxAge: oneDay }) // 一日持つ
				return {
					status: StatusCode.FORBIDDEN,
					response: 'パスワードを5回以上間違えたため、ログインできません',
				}
			} else {
				cookieStore.set(
					`PassFailCount-${bookingId}`,
					(PassFailCount + 1).toString(),
					{
						maxAge: oneDay,
					},
				) // 一日持つ
				return {
					status: StatusCode.BAD_REQUEST,
					response: 'パスワードが違います',
				}
			}

		cookieStore.set('PassFailCount', '0', { maxAge: oneDay }) // 一日持つ
		return { status: StatusCode.OK, response: '認証に成功しました' }
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function updateBookingAction({
	bookingId,
	userId,
	booking,
	isBuyUpdate,
	state,
	expiredAt,
}: {
	bookingId: string
	userId: string
	booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
	isBuyUpdate?: boolean
	state?: BuyBookingStatus
	expiredAt?: string
}): Promise<ApiResponse<string>> {
	try {
		const atBooking = await getBookingById(bookingId)
		if (!atBooking)
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このidの予約は存在しません',
			}

		await updateBooking({
			id: bookingId,
			userId: userId,
			bookingDate: booking.bookingDate,
			bookingTime: booking.bookingTime,
			registName: booking.registName,
			name: booking.name,
			isBuyUpdate: isBuyUpdate ?? false,
			state: state,
			expiredAt: expiredAt,
		})

		revalidateTag('booking')
		revalidateTag(`booking-${bookingId}`)

		return { status: StatusCode.OK, response: '予約情報を更新しました' }
	} catch (error) {
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

		await deleteBooking(bookingId)
		revalidateTag('booking')
		return { status: StatusCode.OK, response: '予約を削除しました' }
	} catch (error) {
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

		const banDates = await getBookingBanDate({
			startDate: ISOstartDate,
			endDate: ISOendDate,
		})

		const transformedBanBookings: BanBooking[] = banDates.map((banBooking) => ({
			id: banBooking.id,
			createdAt: banBooking.created_at,
			updatedAt: banBooking.updated_at,
			startDate: banBooking.start_date,
			startTime: banBooking.start_time,
			endTime: banBooking.end_time ?? banBooking.start_time,
			description: banBooking.description,
			isDeleted: banBooking.is_deleted,
		}))

		return {
			status: StatusCode.OK,
			response: transformedBanBookings,
		}
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}

export async function getBuyBookingByIdAction(
	id: string,
): Promise<ApiResponse<BuyBooking>> {
	try {
		const buyBooking = await getBuyBookingById(id)
		if (!buyBooking)
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このidの予約は存在しません',
			}
		return {
			status: StatusCode.OK,
			response: {
				id: buyBooking.id,
				booking_id: buyBooking.booking_id,
				userId: buyBooking.user_id,
				status: buyBooking.status,
				createdAt: buyBooking.created_at,
				updatedAt: buyBooking.updated_at,
				expiredAt: buyBooking.expire_at,
				isDeleted: buyBooking.is_deleted,
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

export async function bookingRevalidateTagAction({
	tag,
}: {
	tag: string
}): Promise<ApiResponse<string>> {
	try {
		revalidateTag(tag)
		return { status: StatusCode.OK, response: 'リビルドが完了しました' }
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}
