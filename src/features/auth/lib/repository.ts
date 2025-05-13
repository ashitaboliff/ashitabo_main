'use server'

import { compareSync } from 'bcryptjs'
import prisma from '@/lib/prisma'
import { Profile } from '@/features/user/types'

/**
 * DBからパスワードを取得し、入力されたパスワードと照合する関数
 */
export const checkPadLock = async (password: string) => {
	try {
		const hashedPassword = await prisma.padLock.findMany({
			where: {
				is_deleted: {
					not: true,
				},
			},
			select: {
				id: true,
				password: true,
			},
		})
		let match = false

		hashedPassword.forEach(async (padlock) => {
			if (match) {
				return
			}
			match = compareSync(password, padlock.password)
		})
		return match
	} catch (error) {
		throw error
	}
}

/**
 * ユーザが存在するか確認する関数
 */
export const getUser = async (user_id: string) => {
	try {
		const user = await prisma.user.findFirst({
			where: {
				id: user_id,
			},
		})
		return user
	} catch (error) {
		throw error
	}
}

/**
 * プロフィールが存在するか確認する関数
 */
export const getProfile = async (id: string) => {
	try {
		const profile = await prisma.profile.findFirst({
			where: {
				user_id: id,
			},
		})
		return profile
	} catch (error) {
		throw error
	}
}

/**
 * プロフィールを作成する関数
 */
export const createProfile = async (id: string, body: Omit<Profile, 'id'>) => {
	try {
		await prisma.profile.create({
			data: {
				user_id: id,
				name: body.name,
				student_id: body.student_id,
				expected: body.expected,
				role: body.role,
				part: body.part,
				created_at: new Date(),
				is_deleted: false,
			},
		})
	} catch (error) {
		throw error
	}
}

/**
 * プロフィールを更新する関数
 */
export const updateProfile = async (id: string, body: Omit<Profile, 'id'>) => {
	try {
		await prisma.profile.update({
			where: {
				user_id: id,
			},
			data: {
				name: body.name,
				student_id: body.student_id,
				expected: body.expected,
				role: body.role,
				part: body.part,
				updated_at: new Date(),
			},
		})
	} catch (error) {
		throw error
	}
}
