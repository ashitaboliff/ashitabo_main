'use server'

import { ApiResponse, StatusCode } from '@/types/ResponseTypes'
import { revalidateTag } from 'next/cache'
import { v4 } from 'uuid'
import {
	getUserWithName,
	createSchedule,
	createTimeslot,
	getScheduleById,
} from '@/db/Schedule'
import { BookingTime } from '@/features/booking/types'
import {
	UserWithName,
	Schedule,
	generateScheduleTimeExtend,
	SchedulePost,
} from '@/types/ScheduleTypes'

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

export const getScheduleByIdAction = async (
	id: string,
): Promise<ApiResponse<Schedule>> => {
	try {
		const schedule = await getScheduleById(id)
		if (!schedule) {
			return {
				status: StatusCode.NOT_FOUND,
				response: 'Not Found',
			}
		}
		return {
			status: StatusCode.OK,
			response: schedule,
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export const createScheduleAction = async (
	schedule: SchedulePost,
): Promise<ApiResponse<string>> => {
	try {
		const allTimeslots = generateScheduleTimeExtend(BookingTime)

		const offset = [...allTimeslots].findIndex((x) => x === BookingTime[0])
		const timeRange = schedule.timeExtended
			? [...allTimeslots.keys()]
			: [...BookingTime.keys()].map((i) => i + offset)

		const newSchedule = {
			id: schedule.id || v4(),
			userId: schedule.userId,
			title: schedule.title,
			description: schedule.description,
			startDate: schedule.dates[0],
			endDate: schedule.dates[schedule.dates.length - 1],
			mention: schedule.mention,
			timeExtended: schedule.timeExtended,
			deadline: schedule.deadline,
		}
		await createSchedule(newSchedule)

		for (const date of schedule.dates) {
			for (const i of timeRange) {
				await createTimeslot({
					scheduleId: schedule.id || v4(),
					date,
					time: i,
				})
			}
		}

		return {
			status: StatusCode.CREATED,
			response: 'Success',
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}
