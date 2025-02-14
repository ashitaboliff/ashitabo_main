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
		public late: number,
		public items: GachaItem[],
	) {}
}

export default class Gacha {
	private categories: GachaCategory[]

	constructor(version: string) {
		this.categories = [
			new GachaCategory('COMMON', 22500, this.generateItems('C', 20, version)),
			new GachaCategory('RARE', 20000, this.generateItems('R', 15, version)),
			new GachaCategory(
				'SUPER_RARE',
				17000,
				this.generateItems('SR', 10, version),
			),
			new GachaCategory(
				'SS_RARE',
				13000,
				this.generateItems('SSR', 5, version),
			),
			new GachaCategory(
				'ULTRA_RARE',
				5000,
				this.generateItems('UR', 2, version),
			),
			new GachaCategory(
				'SECRET_RARE',
				1,
				this.generateItems('SECRET', 1, version),
			),
		]
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
		const total = this.categories.reduce(
			(sum, cat) => sum + cat.late * cat.items.length,
			0,
		)
		const r = Math.floor(Math.random() * total)
		let accum = 0

		for (const cat of this.categories) {
			const size = cat.late * cat.items.length
			if (r < accum + size) {
				const index = (r - accum) % cat.items.length
				return { data: cat.items[index], name: cat.name }
			}
			accum += size
		}

		return { data: this.categories[0].items[0], name: this.categories[0].name }
	}
}

// // 使い方
// const gacha = new Gacha("version1");
// const result = gacha.pickRandomImage();
// console.log(result);
