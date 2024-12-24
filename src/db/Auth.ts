'use server'

import { compareSync } from 'bcryptjs'
import prisma from '@/lib/prisma/prisma'
import { Profile } from '@/types/UserTypes'

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
			// ひとつでも一致すればtrue
			match = compareSync(password, padlock.password)
		})
		return match
	} catch (error) {
		console.error(error)
		throw new Error('Database query failed')
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
		console.error(error)
		throw new Error('Database query failed')
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
		console.error(error)
		throw new Error('Database query failed')
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
		console.error(error)
		throw new Error('Database query failed')
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
		console.error(error)
		throw new Error('Database query failed')
	}
}
