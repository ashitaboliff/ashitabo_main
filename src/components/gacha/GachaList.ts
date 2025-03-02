import { gachaConfigs, GachaVersionConfig } from './config/gachaConfig'
import { RarityType } from '@/types/GachaTypes'

export class GachaItem {
	constructor(
		public id: number,
		public src: string,
		public title?: string,
	) {}
}

class GachaCategory {
	constructor(
		public name: RarityType,
		public probability: number,
		public items: GachaItem[],
	) {}
}

export default class Gacha {
	private categories: GachaCategory[]

	constructor(version: string) {
		const config: GachaVersionConfig | undefined = gachaConfigs[version]
		if (!config) {
			throw new Error(`Gacha config not found for version: ${version}`)
		}

		this.categories = config.categories.map(
			(catConfig: {
				name: RarityType
				probability: number
				prefix: string
				count: number
			}) =>
				new GachaCategory(
					catConfig.name,
					catConfig.probability,
					this.generateItems(catConfig.prefix, catConfig.count, version),
				),
		)
	}

	private generateItems(
		prefix: string,
		count: number,
		version: string,
	): GachaItem[] {
		return Array.from(
			{ length: count },
			(_, i) =>
				new GachaItem(i + 1, `/gacha/${version}/${prefix}_${i + 1}.png`),
		)
	}

	pickRandomImage(): { data: GachaItem; name: RarityType } {
		// 全カテゴリーの合計「重み」を計算
		const total = this.categories.reduce(
			(sum, cat) => sum + cat.probability * cat.items.length,
			0,
		)
		const r = Math.floor(Math.random() * total)
		let accum = 0

		for (const cat of this.categories) {
			const size = cat.probability * cat.items.length
			if (r < accum + size) {
				const index = (r - accum) % cat.items.length
				return { data: cat.items[index], name: cat.name }
			}
			accum += size
		}

		// 万が一の場合は、最初のカテゴリーの最初のアイテムを返す
		return { data: this.categories[0].items[0], name: this.categories[0].name }
	}
}

// 使い方例
// import Gacha from './Gacha'
// const gacha = new Gacha("version1")
// const result = gacha.pickRandomImage()
// console.log(result)
