export type UserWithName = {
	id: string
	name: string | null
	image?: string | null
}

export type Schedule = {
	id?: string
	userId: string
	title: string
	description: string
	startDate: string
	endDate: string
	mention: string[]
	timeExtended: boolean
	deadline: string
	createdAt?: Date
	updatedAt?: Date
}

export type ScheduleTimeslot = {
	id: string
	scheduleId: string
	timeslotId: string
}
