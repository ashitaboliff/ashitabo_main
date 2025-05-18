import { gachaConfigs, GachaVersionConfig } from './config/gachaConfig'
import { RarityType } from '@/features/gacha/types'

/**
 * ガチャで獲得可能なアイテムを表すクラス
 */
export class GachaItem {
	constructor(
		public id: number,
		public src: string,
		public title?: string,
	) {}
}

/**
 * ガチャアイテムのカテゴリー（レアリティ）を表すクラス
 */
class GachaCategory {
	constructor(
		public name: RarityType, // カテゴリー名（レアリティ）
		public probability: number, // 出現確率
		public items: GachaItem[], // カテゴリーに属するアイテム一覧
	) {}
}

/**
 * ガチャシステムのメインクラス
 */
export default class Gacha {
	private categories: GachaCategory[]

	/**
	 * 指定されたバージョンのガチャを初期化
	 * @param version ガチャのバージョン
	 * @throws バージョンに対応する設定が存在しない場合
	 */
	constructor(version: string) {
		const config = this.getGachaConfig(version)
		this.categories = this.initializeCategories(config, version)
	}

	/**
	 * ガチャの設定を取得
	 */
	private getGachaConfig(version: string): GachaVersionConfig {
		const config = gachaConfigs[version]
		if (!config) {
			throw new Error(`Gacha config not found for version: ${version}`)
		}
		return config
	}

	/**
	 * カテゴリー一覧を初期化
	 */
	private initializeCategories(
		config: GachaVersionConfig,
		version: string,
	): GachaCategory[] {
		return config.categories.map(
			(catConfig) =>
				new GachaCategory(
					catConfig.name,
					catConfig.probability * catConfig.count,
					this.generateItems(catConfig.prefix, catConfig.count, version),
				),
		)
	}

	/**
	 * カテゴリーに属するアイテム一覧を生成
	 */
	private generateItems(
		prefix: string,
		count: number,
		version: string,
	): GachaItem[] {
		return Array.from({ length: count }, (_, i) => {
			const itemId = i + 1
			const imagePath = `/gacha/${version}/${prefix}_${itemId}.png`
			return new GachaItem(itemId, imagePath)
		})
	}

	/**
	 * ランダムにアイテムを1つ選択
	 * @returns 選択されたアイテムとそのレアリティ
	 */
	public pickRandomImage(): { data: GachaItem; name: RarityType } {
		// 重み付き抽選のために確率の合計を計算
		const totalProbability = this.categories.reduce(
			(sum, category) => sum + category.probability,
			0,
		)

		// 0～確率合計の間でランダムな値を生成
		const randomValue = Math.random() * totalProbability

		// 重み付き抽選でカテゴリを選択
		let accumulatedProbability = 0
		for (const category of this.categories) {
			accumulatedProbability += category.probability
			if (randomValue <= accumulatedProbability) {
				// カテゴリが決まったら、そのカテゴリ内でランダムにアイテムを選択
				const randomIndex = Math.floor(Math.random() * category.items.length)
				return { data: category.items[randomIndex], name: category.name }
			}
		}

		// フォールバック（ここには通常到達しないはず）
		return {
			data: this.categories[0].items[0],
			name: this.categories[0].name,
		}
	}
}
