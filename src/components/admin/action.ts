'use server'

import { ApiResponse, StatusCode } from '@/types/ResponseTypes'
import { revalidateTag } from 'next/cache'
import { hashSync } from 'bcryptjs'
import { getUser } from '@/db/Auth'
import {
	getAllUsers,
	getAllUserProfiles,
	deleteUser,
	updateUserRole,
	getAllPadLocks,
	createPadLock,
	deletePadLock,
	createBookingBanDate,
} from '@/db/Admin'
import { AccountRole, User, UserDetail } from '@/types/UserTypes'
import { PadLock } from '@/types/AdminTypes'

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
			response: 'Internal Server Error',
		}
	}
}

export async function getAllUserDetailsAction(): Promise<
	ApiResponse<UserDetail[]>
> {
	try {
		const users = await getAllUsers()
		const userProfiles = await getAllUserProfiles()
		const userDetails: UserDetail[] = users.map((user) => {
			const userProfile = userProfiles.find(
				(profile) => profile.user_id === user.id,
			)
			return {
				id: user.id,
				name: user.name,
				fullName: userProfile?.name ?? undefined,
				studentId: userProfile?.student_id ?? undefined,
				expected: userProfile?.expected ?? undefined,
				image: user.image,
				createAt: user.createdAt,
				updateAt: user.updatedAt,
				AccountRole: user.role,
				role: userProfile?.role,
				part: userProfile?.part,
			}
		})
		return {
			status: StatusCode.OK,
			response: userDetails,
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
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
			response: 'Internal Server Error',
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
			response: 'Internal Server Error',
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
			response: 'Internal Server Error',
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
			response: 'Internal Server Error',
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
			response:
				error instanceof Error ? error.message : 'Internal Server Error',
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
			response: 'Internal Server Error',
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
	endTime: number
	description: string
}): Promise<ApiResponse<string>> {
	try {
		if (Array.isArray(startDate)) {
			for (const date of startDate) {
				await createBookingBanDate({ startDate: date, startTime, endTime, description })
			}
			revalidateTag('booking')
			return {
				status: StatusCode.CREATED,
				response: 'success',
			}
		} else {
			await createBookingBanDate({ startDate, startTime, endTime, description })
			revalidateTag('booking')
			return {
				status: StatusCode.CREATED,
				response: 'success',
			}
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response:
				error instanceof Error ? error.message : 'Internal Server Error',
		}
	}
}
