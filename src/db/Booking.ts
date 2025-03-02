'use server'

import 'server-only'
import prisma from '@/lib/prisma/prisma'
import { v4 } from 'uuid'
import { unstable_cache } from 'next/cache'
import { Booking, BuyBookingStatus } from '@/types/BookingTypes'

/**
 * すべての予約情報を取得する関数
 */
export const getAllBooking = async () => {
	async function getAllBooking() {
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
				orderBy: [{ updated_at: 'desc' }],
			})
			return bookings
		} catch (error) {
			throw error
		}
	}
	const getAllBookingCache = unstable_cache(getAllBooking, [], {
		tags: ['booking'],
	})
	const bookingCacheData = await getAllBookingCache()
	return bookingCacheData
}

export const getAllBuyBooking = async () => {
	async function getAllBuyBooking() {
		try {
			const buyBookings = await prisma.buyBooking.findMany({
				select: {
					id: true,
					booking_id: true,
					user_id: true,
					status: true,
					created_at: true,
					updated_at: true,
					expire_at: true,
					is_deleted: true,
				},
				orderBy: [{ updated_at: 'asc' }],
			})
			return buyBookings
		} catch (error) {
			throw error
		}
	}
	const getAllBuyBookingCache = unstable_cache(getAllBuyBooking, [], {
		tags: ['booking'],
	})
	const buyBookingCacheData = await getAllBuyBookingCache()
	return buyBookingCacheData
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
	async function getBookingByDate({
		startDate,
		endDate,
	}: {
		startDate: string
		endDate: string
	}) {
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
			throw error
		}
	}
	const getBookingByDateCache = unstable_cache(
		getBookingByDate,
		[startDate, endDate],
		{
			tags: [`booking-${startDate}-${endDate}`, 'booking-post', 'booking'],
			revalidate: 60 * 60, // 1時間たったら更新
		},
	)
	const bookingCacheData = await getBookingByDateCache({ startDate, endDate })
	return bookingCacheData
}

/**
 * あるユーザのしたある期間の予約情報を取得する関数
 */
export const getBookingByUserIdAndDate = async ({
	userId,
	startDate,
	endDate,
}: {
	userId: string
	startDate: string
	endDate: string
}) => {
	try {
		const bookings = await prisma.booking.findMany({
			where: {
				AND: {
					user_id: userId,
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
		throw error
	}
}

/**
 * idから予約情報を取得する関数
 * @param id 予約ID
 */
export const getBookingById = async (id: string) => {
	async function getBookingById(id: string) {
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
			throw error
		}
	}
	const getBookingByIdCache = unstable_cache(getBookingById, [id], {
		tags: [`booking-${id}`],
	})
	const bookingCacheData = await getBookingByIdCache(id)
	return bookingCacheData
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
		throw error
	}
}

export const getBookingByUserId = async ({
	userId,
	sort,
	page,
	perPage,
}: {
	userId: string
	sort: 'new' | 'old'
	page: number
	perPage: number
}) => {
	async function getBookingByUserId({
		userId,
		sort,
		page,
		perPage,
	}: {
		userId: string
		sort: 'new' | 'old'
		page: number
		perPage: number
	}) {
		try {
			const [bookings, count] = await Promise.all([
				prisma.booking.findMany({
					where: {
						AND: {
							user_id: userId,
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
					orderBy: [{ updated_at: sort === 'new' ? 'desc' : 'asc' }],
					skip: (page - 1) * perPage,
					take: perPage,
				}),
				prisma.booking.count({
					where: {
						AND: {
							user_id: userId,
							is_deleted: {
								not: true,
							},
						},
					},
				}),
			])
			return { bookings, count }
		} catch (error) {
			throw error
		}
	}

	const getBookingByUserIdCache = unstable_cache(
		getBookingByUserId,
		[userId, sort, page.toString(), perPage.toString()],
		{
			tags: [`booking-${userId}`],
		},
	)
	const bookingCacheData = await getBookingByUserIdCache({
		userId,
		sort,
		page,
		perPage,
	})
	return bookingCacheData
}

/**
 * 予約情報を作成する関数
 * @param Booking Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'user_id'> 予約情報
 * @param userId ユーザID
 */
export const createBooking = async ({
	bookingId,
	booking,
	userId,
	password,
}: {
	bookingId: string
	booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
	userId: string
	password: string
}) => {
	try {
		// await prisma.booking.create({
		// 	data: {
		// 		id: bookingId,
		// 		user_id: userId,
		// 		created_at: new Date(),
		// 		booking_date: booking.bookingDate,
		// 		booking_time: booking.bookingTime,
		// 		regist_name: booking.registName,
		// 		name: booking.name,
		// 		password: password,
		// 	},
		// })
		await prisma.$transaction(async (tx) => {
			await tx.$executeRaw`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`

			await tx.booking.create({
				data: {
					id: bookingId,
					user_id: userId,
					created_at: new Date(),
					booking_date: booking.bookingDate,
					booking_time: booking.bookingTime,
					regist_name: booking.registName,
					name: booking.name,
					password: password,
				},
			})
		})
	} catch (error) {
		throw error
	}
}

/**
 * ハッシュ化されてる予約パスワードを返すだけの関数
 * @param bookingId 予約ID
 */
export const checkBookingPassword = async ({
	bookingId,
}: {
	bookingId: string
}) => {
	try {
		const booking = await prisma.booking.findFirst({
			where: {
				AND: {
					id: bookingId,
					is_deleted: {
						not: true,
					},
				},
			},
		})
		return booking?.password
	} catch (error) {
		throw error
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
	userId,
	bookingDate,
	bookingTime,
	registName,
	name,
	isBuyUpdate,
	state,
	expiredAt,
}: {
	id: string
	userId: string
	bookingDate: string
	bookingTime: number
	registName: string
	name: string
	isBuyUpdate: boolean
	state?: BuyBookingStatus
	expiredAt?: string
}) => {
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

		if (isBuyUpdate) {
			if (state === 'UNPAID') {
				await prisma.buyBooking.create({
					data: {
						id: v4(),
						booking_id: id,
						user_id: userId,
						status: state,
						expire_at: expiredAt ?? '',
					},
				})
			} else {
				await prisma.buyBooking.update({
					where: {
						booking_id: id,
					},
					data: {
						status: state,
					},
				})
			}
		}
	} catch (error) {
		throw error
	}
}

/**
 * 予約情報を削除する関数
 * @param id 予約ID
 */
export const deleteBooking = async (id: string) => {
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
		throw error
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
	async function banBooking({
		startDate,
		endDate,
	}: {
		startDate: string
		endDate: string
	}) {
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
			return exBookings
		} catch (error) {
			throw error
		}
	}
	const banBookingCache = unstable_cache(
		banBooking,
		[startDate, endDate],
		{
			tags: ['banBooking', `booking-${startDate}-${endDate}`],
		}, // これ動的なタグにする必要ないかも
	)
	const banBookingCacheData = await banBookingCache({ startDate, endDate })
	return banBookingCacheData
}

export const getBanBookingByDate = async (date: string) => {
	async function banBooking(date: string) {
		try {
			const exBookings = await prisma.exBooking.findMany({
				where: {
					AND: {
						start_date: date,
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
				orderBy: [{ start_time: 'asc' }],
			})
			return exBookings
		} catch (error) {
			throw error
		}
	}
	const banBookingCache = unstable_cache(banBooking, [date], {
		tags: ['banBooking', `booking-${date}`],
	})

	const banBookingCacheData = await banBookingCache(date)
	return banBookingCacheData
}

export const getBuyBookingById = async (id: string) => {
	const getBuyBookingById = async (id: string) => {
		try {
			const buyBooking = await prisma.buyBooking.findFirst({
				where: {
					booking_id: id,
				},
			})
			return buyBooking
		} catch (error) {
			throw error
		}
	}

	const buyBookingCache = unstable_cache(getBuyBookingById, [id], {
		tags: [`buyBooking`, 'booking'],
	})
	const buyBookingCacheData = await buyBookingCache(id)
	return buyBookingCacheData
}

export const getBuyBookingByUserId = async (userId: string) => {
	const getBuyBookingByUserId = async (userId: string) => {
		try {
			const buyBooking = await prisma.buyBooking.findMany({
				where: {
					user_id: userId,
				},
			})
			return buyBooking
		} catch (error) {
			throw error
		}
	}

	const buyBookingCache = unstable_cache(getBuyBookingByUserId, [userId], {
		tags: [`booking-${userId}`, 'booking', 'buyBooking'],
	})
	const buyBookingCacheData = await buyBookingCache(userId)
	return buyBookingCacheData
}

export const getBuyBookingByExpire = async (expireAt: string) => {
	const getBuyBookingByExpire = async (expireAt: string) => {
		try {
			const buyBooking = await prisma.buyBooking.findMany({
				where: {
					AND: {
						expire_at: expireAt,
						is_deleted: {
							not: true,
						},
						status: {
							notIn: ['EXPIRED', 'PAID'],
						},
					},
				},
			})
			return buyBooking
		} catch (error) {
			throw error
		}
	}

	const buyBookingCache = unstable_cache(getBuyBookingByExpire, [expireAt], {
		tags: [`booking-${expireAt}`, 'booking', 'buyBooking'],
	})
	const buyBookingCacheData = await buyBookingCache(expireAt)
	return buyBookingCacheData
}
