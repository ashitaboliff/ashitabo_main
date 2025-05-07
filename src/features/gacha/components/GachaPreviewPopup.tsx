'use client'

import { useImperativeHandle, forwardRef } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale/ja'
import clsx from 'clsx'
import { RarityType } from '@/types/GachaTypes'
import { gachaConfigs } from '@/components/gacha/config/gachaConfig'
import { CardAnimation } from '@/components/gacha/GachaPickupPopup'

export type GachaPreviewPopupRef =
	| {
			show: () => void
			close: () => void
	  }
	| undefined

const GachaPreviewPopup = forwardRef<
	GachaPreviewPopupRef,
	{
		frontImage: string
		rarity: RarityType
		count: number
		version: string
		getDate: Date
		open: boolean
		onClose: () => void
	}
>(({ open, onClose, frontImage, rarity, count, version, getDate }, ref) => {
	useImperativeHandle(ref, () => ({
		show: () => onClose(),
		close: () => onClose(),
	}))

	return (
		<div className={clsx('modal', open && 'modal-open')} onClick={onClose}>
			<div
				className={clsx(
					'modal-box shadow-lg p-6 flex flex-col gap-y-2 justify-center',
					'max-w-3xl',
				)}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex flex-col items-center h-100 my-2">
					<CardAnimation frontImage={frontImage} rarity={rarity} />
				</div>
				<div className="ml-auto">パック: {gachaConfigs[version].title}</div>
				<div className="ml-auto">所持枚数: {count}枚</div>
				<div className="ml-auto">
					引いた日: {format(getDate, 'yyyy年MM月dd日', { locale: ja })}
				</div>
				<button className="btn btn-outline" onClick={onClose}>
					閉じる
				</button>
			</div>
		</div>
	)
})

GachaPreviewPopup.displayName = 'GachaPreviewPopup'

export default GachaPreviewPopup
