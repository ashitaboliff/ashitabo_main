import { RarityType } from '@/types/GachaTypes'

export interface GachaCategoryConfig {
	name: RarityType
	probability: number
	count: number
	prefix: string
}

export interface GachaVersionConfig {
	categories: GachaCategoryConfig[]
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
	},
	// 他のversionの設定もここで定義可能
	version2: {
		categories: [
			{ name: 'COMMON', probability: 20000, count: 25, prefix: 'C' },
			{ name: 'RARE', probability: 18000, count: 18, prefix: 'R' },
			{ name: 'SUPER_RARE', probability: 15000, count: 12, prefix: 'SR' },
			// 必要ならばさらにレアリティを追加
		],
	},
}
