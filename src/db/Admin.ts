'use server'

import fs from 'fs'
import path from 'path'
import prisma from '@/lib/prisma/prisma'
import { v4 } from 'uuid'
import { unstable_cache } from 'next/cache'
import { AccountRole } from '@/types/UserTypes'

export const getAllUsers = async () => {
	async function getAllUsers() {
		try {
			const users = await prisma.user.findMany()
			return users
		} catch (error) {
			throw error
		}
	}
	const users = unstable_cache(getAllUsers, [], {
		tags: ['users'],
	})
	const result = await users()
	return result
}

export const getAllUserProfiles = async () => {
	async function getAllUserProfiles() {
		try {
			const userProfiles = await prisma.profile.findMany()
			return userProfiles
		} catch (error) {
			throw error
		}
	}
	const userProfiles = unstable_cache(getAllUserProfiles, [], {
		tags: ['user'],
	})
	const result = await userProfiles()
	return result
}

export const deleteUser = async (id: string) => {
	try {
		await prisma.user.delete({
			where: {
				id: id,
			},
		})
	} catch (error) {
		throw error
	}
}

export const updateUserRole = async (id: string, role: AccountRole) => {
	try {
		await prisma.user.update({
			where: {
				id: id,
			},
			data: {
				role: role,
			},
		})
	} catch (error) {
		throw error
	}
}

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
		throw error
	}
}
