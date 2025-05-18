'use server'

import 'server-only'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { v4 } from 'uuid'
import { unstable_cache } from 'next/cache'
import { RarityType, GachaSort } from '@/features/gacha/types'

export const getGachaByUserId = async ({
	userId,
	sort,
	page,
	perPage,
}: {
	userId: string
	sort: GachaSort
	page: number
	perPage: number
}) => {
	async function getGachaByUserId({
		userId,
		sort,
		page,
		perPage,
	}: {
		userId: string
		sort: GachaSort
		page: number
		perPage: number
	}) {
		// ソート条件の組み立て
		let orderByClause
		if (sort === 'new') {
			orderByClause = { createdAt: Prisma.SortOrder.desc }
		} else if (sort === 'old') {
			orderByClause = { createdAt: Prisma.SortOrder.asc }
		} else if (sort === 'rare') {
			// enum の順番 (COMMON, RARE, SUPER_RARE, SS_RARE, ULTRA_RARE, SECRET_RARE)
			orderByClause = { gachaRarity: Prisma.SortOrder.desc }
		} else if (sort === 'notrare') {
			// 上記の順番を逆順に
			orderByClause = { gachaRarity: Prisma.SortOrder.asc }
		}

		try {
			// findMany でページングしたデータ取得と、
			// groupBy で gachaSrc 毎にグループ化して distinct な数を求める
			const [gachas, grouped] = await Promise.all([
				prisma.userGacha.findMany({
					where: { userId },
					orderBy: orderByClause,
					distinct: ['gachaSrc'],
					skip: perPage * (page - 1),
					take: perPage,
				}),
				prisma.userGacha.groupBy({
					by: ['gachaSrc'],
					where: { userId },
				}),
			])

			return { gachas, count: grouped.length }
		} catch (error) {
			throw error
		}
	}

	const gachas = unstable_cache(
		getGachaByUserId,
		[userId, sort, page.toString(), perPage.toString()],
		{
			tags: [`gacha-${userId}`],
		},
	)
	const gachaResult = await gachas({ userId, sort, page, perPage })
	return gachaResult
}

export const getGachaByGachaSrc = async ({
	userId,
	gachaSrc,
}: {
	userId: string
	gachaSrc: string
}) => {
	async function getGachaByGachaSrc({ gachaSrc }: { gachaSrc: string }) {
		try {
			const [gachas, count] = await Promise.all([
				prisma.userGacha.findFirst({
					where: {
						userId,
						gachaSrc,
					},
					orderBy: { createdAt: 'asc' },
				}),
				prisma.userGacha.count({
					where: {
						userId,
						gachaSrc,
					},
				}),
			])
			return { gachas, count }
		} catch (error) {
			throw error
		}
	}

	const gachas = unstable_cache(getGachaByGachaSrc, [gachaSrc], {
		tags: [`gacha-${gachaSrc}-${userId}`],
	})
	const gachaResult = await gachas({ gachaSrc })
	return gachaResult
}

export const createUserGachaResult = async ({
	userId,
	gachaRarity,
	gachaVersion,
	gachaSrc,
}: {
	userId: string
	gachaRarity: RarityType
	gachaVersion: string
	gachaSrc: string
}) => {
	try {
		const userGacha = await prisma.userGacha.create({
			data: {
				id: v4(),
				userId,
				gachaRarity,
				gachaVersion,
				gachaSrc,
			},
		})
		return userGacha
	} catch (error) {
		throw error
	}
}
