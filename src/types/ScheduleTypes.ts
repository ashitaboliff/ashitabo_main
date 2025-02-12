export type UserWithName = {
	id: string
	name: string | null
	image?: string | null
}

export type Schedule = {
	id?: string
	userId: string
	title: string
	description?: string | null
	startDate: string
	endDate: string
	mention: string[]
	timeExtended: boolean
	deadline: string
	createdAt?: Date
	updatedAt?: Date
}

export type SchedulePost = {
	id?: string
	userId: string
	title: string
	description?: string
	dates: string[]
	mention: string[]
	timeExtended: boolean
	deadline: string
}

export type ScheduleTimeslot = {
	id: string
	scheduleId: string
	timeslotId: string
}

export const generateScheduleTimeExtend = (bookingTimes: string[]) => {
	const parseTime = (timeStr: string) => {
		const [hour, minute] = timeStr.split(':').map(Number)
		return hour + minute / 60
	}

	// `BookingTime` の最初と最後の時間を取得
	const firstStartTime = parseTime(bookingTimes[0].split('~')[0]) // 7:30 → 7.5
	const lastEndTime = parseTime(
		bookingTimes[bookingTimes.length - 1].split('~')[1],
	) // 21:00 → 21

	const scheduleTimeExtend: string[] = []

	// 0:00 ~ `firstStartTime` まで 1時間ごとのスロットを作成
	for (let t = 0; t < firstStartTime; t++) {
		let timeRange = `${t}:00~${t + 1}:00`
		if (t + 1 > firstStartTime) {
			timeRange = `${t}:00~${t}:${(firstStartTime - t) * 60}`
		}
		scheduleTimeExtend.push(timeRange)
	}

	// `BookingTime` をそのまま追加
	bookingTimes.forEach((time, index) => {
		scheduleTimeExtend.push(time)
	})

	// `lastEndTime` ~ 24:00 まで 1時間ごとのスロットを作成
	if (lastEndTime % 1 !== 0) {
		const lastHour = Math.floor(lastEndTime)
		for (let t = lastHour; t < 24; t++) {
			let timeRange = `${t}:00~${t + 1}:00`
			if (t === lastHour) {
				timeRange = `${t}:${(lastEndTime - t) * 60}~${t + 1}:00`
			}
			scheduleTimeExtend.push(timeRange)
		}
	} else {
		for (let t = lastEndTime; t < 24; t++) {
			const timeRange = `${t}:00~${t + 1}:00`
			scheduleTimeExtend.push(timeRange)
		}
	}

	return scheduleTimeExtend
}
