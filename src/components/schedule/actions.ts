'use server'

import { ApiResponse, StatusCode } from '@/types/ResponseTypes'
import { revalidateTag } from 'next/cache'
import { getUserWithName } from '@/db/Schedule'
import { UserWithName } from '@/types/ScheduleTypes'

export const getUserIdWithNames = async (): Promise<
	ApiResponse<UserWithName[]>
> => {
	try {
		const users = await getUserWithName()
		const userWithNames: UserWithName[] = users.map((user) => ({
			id: user.id,
			name: user.name,
			image: user.image,
		}))
		return {
			status: StatusCode.OK,
			response: userWithNames,
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}
