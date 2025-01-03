'use server'

import fs from 'fs'
import path from 'path'
import prisma from '@/lib/prisma/prisma'
import { v4 } from 'uuid'

/**
 * 予約禁止日を作成する関数
 * @param startDate 開始日ISO形式
 * @param startTime 開始時間
 * @param endTime 終了時間
 * @param description 禁止理由
 */
export const createBookingBanDate = async ({
	startDate,
	startTime,
	endTime,
	description,
}: {
	startDate: string
	startTime: number
	endTime?: number
	description: string
}) => {
	try {
		await prisma.exBooking.create({
			data: {
				id: v4(),
				start_date: startDate,
				start_time: startTime,
				end_time: endTime,
				description: description,
			},
		})
	} catch (error) {
		console.error(error)
		throw new Error('Database query failed')
	}
}
