'use server'

import { ApiResponse, StatusCode } from '@/utils/types/responseTypes'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { addHours } from 'date-fns'
import {
	getGachaByUserId,
	getGachaByGachaSrc,
	createUserGachaResult,
} from '@/features/gacha/lib/repository'
import {
	GachaSort,
	GachaData,
	RarityType,
	GachaCreateType,
} from '@/features/gacha/types'

export async function getGachaByUserIdAction({
	userId,
	sort,
	page,
	perPage,
}: {
	userId: string
	sort: GachaSort
	page: number
	perPage: number
}): Promise<ApiResponse<{ gacha: GachaData[]; totalCount: number }>> {
	try {
		const { gachas, count } = await getGachaByUserId({
			userId,
			sort,
			page,
			perPage,
		})

		const transformedGachas: GachaData[] = gachas.map((gacha) => {
			return {
				id: gacha.id,
				userId: gacha.userId,
				gachaVersion: gacha.gachaVersion,
				gachaRarity: gacha.gachaRarity,
				gachaSrc: gacha.gachaSrc,
				createdAt: gacha.createdAt,
				updatedAt: gacha.updatedAt,
				isDeleted: gacha.isDeleted,
			}
		})

		return {
			status: StatusCode.OK,
			response: { gacha: transformedGachas, totalCount: count },
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export async function getGachaByGachaSrcAction({
	userId,
	gachaSrc,
}: {
	userId: string
	gachaSrc: string
}): Promise<ApiResponse<{ gacha: GachaData; totalCount: number }>> {
	try {
		const { gachas, count } = await getGachaByGachaSrc({ userId, gachaSrc })

		if (!gachas) {
			return { status: StatusCode.NOT_FOUND, response: 'Not Found' }
		}

		return {
			status: StatusCode.OK,
			response: { gacha: gachas, totalCount: count },
		}
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}

export async function createUserGachaResultAction({
	userId,
	gachaRarity,
	gachaVersion,
	gachaSrc,
}: {
	userId: string | undefined
	gachaRarity: RarityType
	gachaVersion: string
	gachaSrc: string
}): Promise<ApiResponse<string>> {
	try {
		if (!userId) {
			return { status: StatusCode.BAD_REQUEST, response: 'User not found' }
		}

		await createUserGachaResult({
			userId,
			gachaRarity,
			gachaVersion,
			gachaSrc,
		})

		revalidateTag(`gacha-${gachaSrc}-${userId}`)
		revalidateTag(`gacha-${userId}`)
		return { status: StatusCode.CREATED, response: 'success' }
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}
