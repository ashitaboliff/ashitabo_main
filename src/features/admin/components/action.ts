'use server'

import { ApiResponse, StatusCode } from '@/utils/types/responseTypes'
import { revalidateTag } from 'next/cache'
import { hashSync } from 'bcryptjs'
import { getUser } from '@/features/auth/lib/repository'
import {
	getUserWithProfile,
	deleteUser,
	updateUserRole,
	getAllPadLocks,
	createPadLock,
	deletePadLock,
	getAllBanBooking,
	createBookingBanDate,
	deleteBanBooking,
	getBuyBookingByStatus,
	updateBuyBooking,
} from '@/features/admin/lib/repository'
import { AccountRole, UserDetail } from '@/features/user/types'
import { PadLock } from '@/features/admin/types'
import { BanBooking, BuyBooking } from '@/features/booking/types'

export async function adminRevalidateTagAction(
	tag: string,
): Promise<ApiResponse<string>> {
	try {
		revalidateTag(tag)
		return {
			status: StatusCode.OK,
			response: 'リビルド完了',
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export async function getAllUserDetailsAction({
	sort,
	page,
	perPage,
}: {
	sort: string
	page: number
	perPage: number
}): Promise<ApiResponse<{ users: UserDetail[]; totalCount: number }>> {
	try {
		const { users, count } = await getUserWithProfile({ sort, page, perPage })
		const userDetails: UserDetail[] = users.map((user) => ({
			id: user.id,
			name: user.name,
			fullName: user.profile?.name ?? undefined,
			studentId: user.profile?.student_id ?? undefined,
			expected: user.profile?.expected ?? undefined,
			image: user.image,
			createAt: user.createdAt,
			updateAt: user.updatedAt,
			AccountRole: user.role,
			role: user.profile?.role,
			part: user.profile?.part,
		}))

		return {
			status: StatusCode.OK,
			response: { users: userDetails, totalCount: count },
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export async function deleteUserAction({
	id,
	role,
}: {
	id: string
	role: AccountRole | null
}): Promise<ApiResponse<string>> {
	try {
		if (role !== 'ADMIN') {
			return {
				status: StatusCode.FORBIDDEN,
				response: 'このユーザは削除できません',
			}
		}
		await deleteUser(id)
		return {
			status: StatusCode.OK,
			response: '削除完了',
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export async function getUserRoleAction(
	userId: string,
): Promise<ApiResponse<string>> {
	try {
		const user = await getUser(userId)
		if (!user) {
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このidのユーザは存在しません',
			}
		}
		return {
			status: StatusCode.OK,
			response: user.role as string,
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export async function updateUserRoleAction({
	id,
	role,
}: {
	id: string
	role: AccountRole
}): Promise<ApiResponse<string>> {
	try {
		await updateUserRole(id, role)
		return {
			status: StatusCode.OK,
			response: '更新完了',
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export async function getAllPadLocksAction(): Promise<ApiResponse<PadLock[]>> {
	try {
		const padLocks = await getAllPadLocks()
		const shapedPadLocks = padLocks.map((p) => ({
			id: p.id,
			name: p.name,
			createdAt: p.created_at,
			updatedAt: p.updated_at,
			isDeleted: p.is_deleted,
		}))
		return {
			status: StatusCode.OK,
			response: shapedPadLocks,
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export async function createPadLockAction({
	name,
	password,
}: {
	name: string
	password: string
}): Promise<ApiResponse<string>> {
	try {
		const hashedPassword = hashSync(password, 10)
		await createPadLock({ name, password: hashedPassword })
		revalidateTag('padlocks')
		return {
			status: StatusCode.CREATED,
			response: 'success',
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export async function deletePadLockAction(
	id: string,
): Promise<ApiResponse<string>> {
	try {
		await deletePadLock(id)
		revalidateTag('padlocks')
		return {
			status: StatusCode.OK,
			response: '削除完了',
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export async function getAllBanBookingAction(): Promise<
	ApiResponse<BanBooking[]>
> {
	try {
		const banBookingDates = await getAllBanBooking()
		const dates = banBookingDates.map((date) => ({
			id: date.id,
			startDate: date.start_date,
			startTime: date.start_time,
			endTime: date.end_time,
			description: date.description,
			createdAt: date.created_at,
			updatedAt: date.updated_at,
			isDeleted: date.is_deleted,
		}))
		return {
			status: StatusCode.OK,
			response: dates,
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export async function createBookingBanDateAction({
	startDate,
	startTime,
	endTime,
	description,
}: {
	startDate: string | string[]
	startTime: number
	endTime?: number
	description: string
}): Promise<ApiResponse<string>> {
	try {
		if (Array.isArray(startDate)) {
			for (const date of startDate) {
				await createBookingBanDate({
					startDate: date,
					startTime,
					endTime,
					description,
				})
			}
			revalidateTag('banBooking')
			return {
				status: StatusCode.CREATED,
				response: 'success',
			}
		} else {
			await createBookingBanDate({ startDate, startTime, endTime, description })
			revalidateTag('banBooking')
			return {
				status: StatusCode.CREATED,
				response: 'success',
			}
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export async function deleteBanBookingAction(
	id: string,
): Promise<ApiResponse<string>> {
	try {
		await deleteBanBooking(id)
		revalidateTag('banBooking')
		return {
			status: StatusCode.OK,
			response: '削除完了',
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export async function getBuyBookingByStatusAction({
	status,
}: {
	status: BuyBooking['status'][]
}): Promise<ApiResponse<BuyBooking[]>> {
	try {
		const buyBooking = await getBuyBookingByStatus({ status })

		const transformedBuyBookings: BuyBooking[] = buyBooking.map((booking) => ({
			id: booking.id,
			bookingId: booking.booking_id,
			userId: booking.user_id,
			status: booking.status,
			createdAt: booking.created_at,
			updatedAt: booking.updated_at,
			expiredAt: booking.expire_at,
			isDeleted: booking.is_deleted,
		}))
		return {
			status: StatusCode.OK,
			response: transformedBuyBookings,
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export async function updateBuyBookingAction({
	bookingId,
	state,
}: {
	bookingId: string
	state: BuyBooking['status']
}): Promise<ApiResponse<string>> {
	try {
		await updateBuyBooking({ bookingId, state })
		revalidateTag('booking')
		revalidateTag('buyBooking')
		return {
			status: StatusCode.OK,
			response: '更新完了',
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}
