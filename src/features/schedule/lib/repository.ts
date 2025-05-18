'use server'

import 'server-only'
import prisma from '@/lib/prisma'
import { v4 } from 'uuid'
import { unstable_cache } from 'next/cache'
import { Schedule } from '@/features/schedule/types'

export const getUserWithName = async () => {
	async function getUserWithName() {
		try {
			const users = await prisma.user.findMany()
			return users
		} catch (error) {
			throw error
		}
	}
	const users = unstable_cache(getUserWithName, [], {
		tags: ['users'],
	})
	const result = await users()
	return result
}

export const getScheduleById = async (id: string) => {
	try {
		const schedule = await prisma.schedule.findUnique({
			where: {
				id: id,
			},
		})
		return schedule
	} catch (error) {
		throw error
	}
}

export const createSchedule = async (Schedule: Schedule) => {
	try {
		await prisma.schedule.create({
			data: {
				id: Schedule.id,
				userId: Schedule.userId,
				title: Schedule.title,
				description: Schedule.description,
				startDate: Schedule.startDate,
				endDate: Schedule.endDate,
				mention: Schedule.mention,
				timeExtended: Schedule.timeExtended,
				deadline: Schedule.deadline,
			},
		})
	} catch (error) {
		throw error
	}
}

export const createTimeslot = async ({
	scheduleId,
	date,
	time,
}: {
	scheduleId: string
	date: string
	time: number
}) => {
	try {
		const timeslot = await prisma.timeslot.create({
			data: {
				scheduleId: scheduleId,
				date: date,
				time: time,
			},
		})
		return timeslot
	} catch (error) {
		throw error
	}
}
