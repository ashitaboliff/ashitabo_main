export type RarityType =
	| 'COMMON'
	| 'RARE'
	| 'SUPER_RARE'
	| 'SS_RARE'
	| 'ULTRA_RARE'
	| 'SECRET_RARE'

export type GachaSort = 'new' | 'old' | 'rare' | 'notrare'

export type GachaData = {
	userId: string
	id: string
	gachaVersion: string
	gachaRarity: RarityType
	gachaSrc: string
	createdAt: Date
	updatedAt: Date
	isDeleted: boolean
}

export type GachaCreateType = 'booking' | 'user'

export const GachaPackVersion: Record<string, string> = {
	version1: 'OBのいる島',
}
