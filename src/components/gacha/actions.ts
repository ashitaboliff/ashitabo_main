'use server'

import { ApiResponse, StatusCode } from '@/types/ResponseTypes'
import { cookies } from 'next/headers'
import { revalidatePath, revalidateTag } from 'next/cache'
import { addHours } from 'date-fns'
import {
	getGachaByUserId,
	getGachaByGachaSrc,
	createUserGachaResult,
} from '@/db/Gacha'
import {
	GachaSort,
	GachaData,
	RarityType,
	GachaCreateType,
} from '@/types/GachaTypes'

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
	createType,
}: {
	userId: string | undefined
	gachaRarity: RarityType
	gachaVersion: string
	gachaSrc: string
	createType: GachaCreateType
}): Promise<ApiResponse<string>> {
	try {
		if (!userId) {
			return { status: StatusCode.BAD_REQUEST, response: 'User not found' }
		}

		if (createType === 'user') {
			const cookieStore = await cookies()
			let gachaCount = Number(cookieStore.get('gachaCount')?.value) || 0
			const gachaCheckRes = await checkGachaCookieAction()
			if (gachaCheckRes.status !== StatusCode.OK) {
				return {
					status: StatusCode.BAD_REQUEST,
					response: gachaCheckRes.response,
				}
			} else {
				gachaCount += 1
				cookieStore.set('gachaCount', gachaCount.toString(), {
					maxAge: 60 * 60 * 24,
				})
				cookieStore.set('gachaDate', new Date().toISOString(), {
					maxAge: 86400,
				})

				await createUserGachaResult({
					userId,
					gachaRarity,
					gachaVersion,
					gachaSrc,
				})
			}
		} else {
			await createUserGachaResult({
				userId,
				gachaRarity,
				gachaVersion,
				gachaSrc,
			})
		}
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

export const checkGachaCookieAction = async () => {
	const cookieStore = await cookies()
	const gachaCookie = cookieStore.get('gachaDate')
	const gachaDate =
		gachaCookie && gachaCookie.value
			? addHours(new Date(gachaCookie.value), 9)
			: undefined
	let gachaCount = Number(cookieStore.get('gachaCount')?.value) || 0

	if (gachaDate) {
		const today = addHours(new Date(), 9)
		if (
			gachaDate.getDate() === today.getDate() &&
			gachaDate.getMonth() === today.getMonth() &&
			gachaDate.getFullYear() === today.getFullYear() &&
			gachaCount === 2
		) {
			return {
				status: StatusCode.BAD_REQUEST,
				response:
					'本日は既にガチャを2回引いているため、これ以上引くことはできません。',
			}
		} else if (gachaDate.getDate() !== today.getDate()) {
			cookieStore.set('gachaCount', '0', { maxAge: 60 * 60 * 24 })
			return { status: StatusCode.OK, response: 'success' }
		}
	}
	return { status: StatusCode.OK, response: 'success' }
}
