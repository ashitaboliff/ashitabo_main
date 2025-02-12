'use server'

import 'server-only'
import prisma from '@/lib/prisma/prisma'
import { v4 } from 'uuid'
import { unstable_cache } from 'next/cache'

export const getGachaByUserId = async ({
	userId,
	sort,
	page,
	perPage,
}: {
	userId: string
	sort: 'new' | 'old'
	page: number
	perPage: number
}) => {
	async function getGachas({
		userId,
		sort,
		page,
		perPage,
	}: {
		userId: string
		sort: 'new' | 'old'
		page: number
		perPage: number
	}) {
		try {
			const [gachas, count] = await Promise.all([
				prisma.userGacha.findMany({
					where: {
						userId,
					},
					orderBy: {
						createdAt: sort === 'new' ? 'desc' : 'asc',
					},
					skip: perPage * (page - 1),
					take: perPage,
				}),
				prisma.userGacha.count({
					where: {
						userId,
					},
				}),
			])
			return { gachas, count }
		} catch (error) {
			throw error
		}
	}

	const gachas = unstable_cache(
		getGachas,
		[userId, sort, page.toString(), perPage.toString()],
		{
			tags: [`gacha-${userId}`],
		},
	)
	const gachaResult = await gachas({ userId, sort, page, perPage })
	return gachaResult
}

export const createUserGachaResult = async ({
	userId,
	gachaSrc,
}: {
	userId: string
	gachaSrc: string
}) => {
	try {
		const userGacha = await prisma.userGacha.create({
			data: {
				id: v4(),
				userId,
				gachaSrc,
			},
		})
		return userGacha
	} catch (error) {
		throw error
	}
}
