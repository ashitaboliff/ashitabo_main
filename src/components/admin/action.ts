'use server'

import { ApiResponse, StatusCode } from '@/types/ResponseTypes'
import { getUser } from '@/db/Auth'

export async function getUserRoleAction(
	user_id: string,
): Promise<ApiResponse<string>> {
	try {
		const user = await getUser(user_id)
		if (!user) {
			return {
				status: StatusCode.NOT_FOUND,
				response: 'このidのユーザは存在しません',
			}
		} else if (user.role === 'ADMIN') {
			return {
				status: StatusCode.OK,
				response: 'admin',
			}
		} else {
			return {
				status: StatusCode.OK,
				response: 'user',
			}
		}
	} catch (error) {
		console.error(error)
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: 'Internal Server Error',
		}
	}
}
