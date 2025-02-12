'use client'

import { useEffect, useImperativeHandle, forwardRef, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import clsx from 'clsx'
import { BsStars } from 'react-icons/bs'
import Gacha from '@/components/gacha/GachaList'
import { RarityType } from '@/types/GachaTypes'

export type GachaPickupPopupRef =
	| {
			show: () => void
			close: () => void
	  }
	| undefined

interface CardProps {
	frontImage: string
	backImage: string
	rarity: RarityType
}

const CardAnimation = ({ frontImage, backImage, rarity }: CardProps) => {
	const cardRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!cardRef.current) return

		// カードの360°回転（1度きり）のアニメーション
		if (rarity === 'common') {
			gsap.to(cardRef.current, {
				scale: 1.1,
				duration: 0.2,
				yoyo: true,
				repeat: 1,
				ease: 'none',
			})
		} else if (rarity === 'rare' || rarity === 'superRare') {
			gsap.to(cardRef.current, {
				rotationY: 360,
				duration: 2,
				ease: 'power1.inOut',
			})
		} else if (rarity === 'ssRare') {
			gsap.to(cardRef.current, {
				rotationY: 360,
				duration: 2,
				ease: 'expo.inOut',
			})
		} else if (rarity === 'ultraRare' || rarity === 'secretRare') {
			// ultraRare, secretRare でバウンド（ポップアップ）効果を追加
			gsap.to(cardRef.current, {
				rotationY: 360,
				duration: 2,
				ease: 'expo.inOut',
			})
			gsap.to(cardRef.current, {
				scale: 1.1,
				duration: 1.1,
				yoyo: true,
				repeat: 1,
				ease: 'back.out',
			})
		}

		// sparkleエフェクトのアニメーション（対象は各BsStarsアイコン）
		if (['superRare', 'ssRare', 'ultraRare', 'secretRare'].includes(rarity)) {
			gsap.to('.sparkle-star', {
				opacity: 0.2,
				scale: 1.5,
				duration: 0.8,
				yoyo: true,
				repeat: -1,
				ease: 'power1.inOut',
			})
		}
	}, [rarity])

	// レアリティに応じたsparkleのサイズと色設定
	// superRare は小さめ、ssRare/ultraRare は大きめ、secretRare は黒色に設定
	const starSize = rarity === 'superRare' ? 30 : 40
	const starColor = rarity === 'secretRare' ? '#000' : '#FFD700'

	// カード周囲に散らばる星の配置（絶対配置のスタイルを inline で指定）
	const starPositions = [
		{ top: '2%', left: '10%' },
		{ top: '12%', right: '5%' },
		{ bottom: '8%', left: '15%' },
		{ bottom: '5%', right: '10%' },
		{ top: '45%', left: '80%' },
	]

	return (
		<div className="relative w-75 h-100" style={{ perspective: '1000px' }}>
			{/* カード本体 */}
			<div ref={cardRef} className="w-full h-full transform-style-3d relative">
				{/* 表面 */}
				<div className="absolute w-full h-full backface-hidden">
					<img
						src={frontImage}
						alt="Card Front"
						className="w-full h-full object-cover"
					/>
				</div>
				{/* 裏面（rotateY-180で配置） */}
				<div className="absolute w-full h-full backface-hidden rotateY-180">
					<img
						src={backImage}
						alt="Card Back"
						className="w-full h-full object-cover"
					/>
				</div>
			</div>

			{/* Sparkleエフェクト：対象レアリティの場合のみ表示 */}
			{['superRare', 'ssRare', 'ultraRare', 'secretRare'].includes(rarity) && (
				<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
					{starPositions.map((pos, index) => (
						<BsStars
							key={index}
							className="sparkle-star absolute"
							size={starSize}
							color={starColor}
							style={pos}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export const GachaPickup = () => {
	const gacha = new Gacha('version1')
	const { data, name } = gacha.pickRandomImage()

	return (
		<div className="flex flex-col items-center h-100">
			<CardAnimation
				frontImage={data.src}
				backImage="/gacha/backimage.png"
				rarity={name}
			/>
		</div>
	)
}

const GachaPickupPopup = forwardRef<
	GachaPickupPopupRef,
	{
		open: boolean
		onClose: () => void
	}
>(({ open, onClose }, ref) => {
	useImperativeHandle(ref, () => ({
		show: () => onClose(),
		close: () => onClose(),
	}))

	return (
		<div className={clsx('modal', open && 'modal-open')} onClick={onClose}>
			<div
				className={clsx(
					'modal-box bg-base-100 rounded-lg shadow-lg p-6 flex flex-col gap-y-2 justify-center',
					'max-w-3xl',
				)}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="text-center mb-4 text-xl font-bold">ガチャ結果</div>

				<GachaPickup />
				<button className="btn btn-outline" onClick={onClose}>
					閉じる
				</button>
			</div>
		</div>
	)
})

GachaPickupPopup.displayName = 'GachaPickupPopup'

export default GachaPickupPopup
