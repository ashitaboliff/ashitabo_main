'use server'

import 'server-only'
import prisma from '@/lib/prisma/prisma'
import { v4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import { unstable_cache } from 'next/cache'
import { Schedule } from '@/types/ScheduleTypes'

export const getExtendCalendarTime = async () => {
	async function calendarTime() {
		const filePath = path.join(
			process.cwd(),
			'/src/db/data',
			'TimeDataExtend.csv',
		)
		try {
			const absolutePath = path.resolve(filePath)
			if (!fs.existsSync(absolutePath)) {
				throw new Error(`File not found: ${filePath}`)
			}
			const data = fs.readFileSync(absolutePath, 'utf-8')
			return data
				.split('\n')
				.map((line) => line.trim().replace(',', ''))
				.filter((line) => line !== '')
		} catch (error) {
			throw error
		}
	}
	const calendarTimeCache = unstable_cache(calendarTime, [], {
		tags: ['extendCalendarTime'],
	})
	return await calendarTimeCache()
}

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

export const createScheduleTimeslot = async (
	scheduleId: string,
	timeslotId: string,
) => {
	try {
		await prisma.scheduleTimeslot.create({
			data: {
				scheduleId: scheduleId,
				timeslotId: timeslotId,
			},
		})
	} catch (error) {
		throw error
	}
}

export const createTimeslot = async ({
	date,
	time,
}: {
	date: string
	time: number
}) => {
	try {
		const timeslot = await prisma.timeslot.create({
			data: {
				date: date,
				time: time,
			},
		})
		return timeslot
	} catch (error) {
		throw error
	}
}

export const getTimeSlotsByDateTimes = async ({
	date,
	time,
}: {
	date: string
	time: number
}) => {
	try {
		async function getTimeSlotsByDateTimes() {
			const timeslot = await prisma.timeslot.findUnique({
				where: { date_time: { date: date, time: time } },
			})
			return timeslot
		}
		const timeslot = unstable_cache(
			getTimeSlotsByDateTimes,
			[date, time.toString()],
			{
				tags: [`timeslot-${date}-${time}`],
			},
		)
		const result = await timeslot()
		return result
	} catch (error) {
		throw error
	}
}
