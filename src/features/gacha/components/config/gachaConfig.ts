import { RarityType } from '@/features/gacha/types'

export interface GachaCategoryConfig {
	name: RarityType
	probability: number
	count: number
	prefix: string
}

export interface GachaVersionConfig {
	categories: GachaCategoryConfig[]
	title: string
	packImage?: string
}

export const gachaConfigs: { [version: string]: GachaVersionConfig } = {
	version1: {
		categories: [
			{ name: 'COMMON', probability: 22500, count: 20, prefix: 'C' },
			{ name: 'RARE', probability: 20000, count: 15, prefix: 'R' },
			{ name: 'SUPER_RARE', probability: 17000, count: 10, prefix: 'SR' },
			{ name: 'SS_RARE', probability: 13000, count: 5, prefix: 'SSR' },
			{ name: 'ULTRA_RARE', probability: 5000, count: 2, prefix: 'UR' },
			{ name: 'SECRET_RARE', probability: 1, count: 1, prefix: 'SECRET' },
		],
		title: 'OBのいる島',
		packImage: '/gacha/version1/pack.png',
	},
	// 他のversionの設定もここで定義可能
	version2: {
		categories: [
			{ name: 'COMMON', probability: 200, count: 20, prefix: 'C' },
			{ name: 'RARE', probability: 160, count: 15, prefix: 'R' },
			{ name: 'SUPER_RARE', probability: 150, count: 10, prefix: 'SR' },
			{ name: 'SS_RARE', probability: 125, count: 4, prefix: 'SSR' },
			{ name: 'ULTRA_RARE', probability: 100, count: 1, prefix: 'UR' },
		],
		title: '卒業生の暴獣',
		packImage: '/gacha/version2/pack.png',
	},
}
