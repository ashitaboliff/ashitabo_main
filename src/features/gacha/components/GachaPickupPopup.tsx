'use client'

import {
	useEffect,
	useImperativeHandle,
	forwardRef,
	useRef,
	useMemo,
	useState,
} from 'react'
import gsap from 'gsap'
import clsx from 'clsx'
import Gacha, { GachaItem } from '@/features/gacha/components/GachaList'
import { RarityType, GachaCreateType } from '@/features/gacha/types'
import { createUserGachaResultAction } from '@/features/gacha/components/actions'
import { getSession } from '@/app/actions'
import { ApiResponse } from '@/utils/types/responseTypes'

export type GachaPickupPopupRef =
	| {
			show: () => void
			close: () => void
	  }
	| undefined

interface CardProps {
	frontImage: string
	rarity: RarityType
	delay?: number
}

// 固定のfpstar形状のキラキラコンポーネント
interface SparkleProps {
	size: number
	color: string
	style?: React.CSSProperties
	className?: string
}
const Sparkle = ({ size, color, style = {}, className }: SparkleProps) => {
	// すべて固定：形はfpstar、回転は0°
	const combinedStyle = { ...style, transform: 'rotate(0deg)' }
	return (
		<svg
			width={size}
			height={size}
			style={combinedStyle}
			className={className}
			viewBox="0 0 100 100"
		>
			{color === '#000' ? (
				<polygon
					points="50,0 65,40 100,50 65,60 50,100 35,60 0,50 35,40"
					fill={color}
				/>
			) : (
				<polygon
					points="50,0 65,40 100,50 65,60 50,100 35,60 0,50 35,40"
					fill="url(#goldGradient)"
				/>
			)}
		</svg>
	)
}

/**
 * カードの情報を引数に、カードのアニメーションを行うコンポーネント
 * @param frontImage 表面画像
 * @param rarity レアリティ
 * @param delay 表示までの遅延時間
 * @returns
 */
export const CardAnimation = ({ frontImage, rarity, delay }: CardProps) => {
	const cardRef = useRef<HTMLDivElement>(null)
	const [imagesLoaded, setImagesLoaded] = useState<number>(0)
	const backImage = '/gacha/backimage.png'

	// 画像が読み込まれたらカウントアップ
	const handleImageLoad = () => {
		setImagesLoaded((prev) => prev + 1)
	}

	useEffect(() => {
		if (!cardRef.current || imagesLoaded < 2) return

		if (delay) {
			setTimeout(() => {
				gsap.to(cardRef.current, {
					opacity: 1,
					duration: 0.5,
				})
			}, delay)
		}

		// カード本体のアニメーション（レアリティに応じた処理）
		if (rarity === 'COMMON') {
			gsap.to(cardRef.current, {
				scale: 1.1,
				duration: 0.2,
				yoyo: true,
				repeat: 1,
				ease: 'none',
			})
		} else if (rarity === 'RARE' || rarity === 'SUPER_RARE') {
			gsap.to(cardRef.current, {
				rotationY: 360,
				duration: 2,
				ease: 'power1.inOut',
			})
		} else if (rarity === 'SS_RARE') {
			gsap.to(cardRef.current, {
				rotationY: 360,
				duration: 2,
				ease: 'expo.inOut',
			})
		} else if (rarity === 'ULTRA_RARE' || rarity === 'SECRET_RARE') {
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

		// ※ 星のアニメーション自体は gsap で共通に実施（固定パラメータ）
		gsap.to('.sparkle-star', {
			opacity: 0.5,
			scale: 1.5,
			duration: 0.8,
			yoyo: true,
			repeat: -1,
			ease: 'power1.inOut',
		})
	}, [rarity, imagesLoaded])

	// レアリティに合わせた基準サイズ設定
	// SUPER_RAREは15、それ以外は20
	const starBaseSize = rarity === 'SUPER_RARE' ? 15 : 20
	// SECRETの場合は色はそのまま黒、その他はグラデーション（金色）
	const starColor = rarity === 'SECRET_RARE' ? '#000' : '#FFD700'

	// 固定の40個の星の表示位置（中央を避け、カードなど他の要素と重ならないよう端部に配置）
	const fixedStarPositions = useMemo(() => {
		const topPositions = [
			{ top: '9%', left: '5%' },
			{ top: '5%', left: '10%' },
			{ top: '11%', left: '15%' },
			{ top: '5%', left: '20%' },
			{ top: '8%', left: '25%' },
			{ top: '5%', right: '5%' },
			{ top: '13%', right: '10%' },
			{ top: '8%', right: '15%' },
			{ top: '2%', right: '20%' },
			{ top: '5%', right: '25%' },
		]
		const bottomPositions = [
			{ bottom: '4%', left: '5%' },
			{ bottom: '4%', left: '10%' },
			{ bottom: '5%', left: '15%' },
			{ bottom: '5%', left: '20%' },
			{ bottom: '2%', left: '25%' },
			{ bottom: '8%', right: '5%' },
			{ bottom: '9%', right: '10%' },
			{ bottom: '5%', right: '15%' },
			{ bottom: '12%', right: '20%' },
			{ bottom: '8%', right: '25%' },
		]
		const leftPositions = [
			{ left: '8%', top: '5%' },
			{ left: '4%', top: '10%' },
			{ left: '6%', top: '15%' },
			{ left: '5%', top: '20%' },
			{ left: '5%', top: '25%' },
			{ left: '7%', bottom: '5%' },
			{ left: '5%', bottom: '10%' },
			{ left: '16%', bottom: '15%' },
			{ left: '5%', bottom: '20%' },
			{ left: '5%', bottom: '25%' },
		]
		const rightPositions = [
			{ right: '5%', top: '5%' },
			{ right: '5%', top: '10%' },
			{ right: '10%', top: '15%' },
			{ right: '4%', top: '20%' },
			{ right: '5%', top: '25%' },
			{ right: '4%', bottom: '5%' },
			{ right: '5%', bottom: '10%' },
			{ right: '7%', bottom: '15%' },
			{ right: '3%', bottom: '20%' },
			{ right: '11%', bottom: '25%' },
		]
		return [
			...topPositions,
			...bottomPositions,
			...leftPositions,
			...rightPositions,
		]
	}, [])

	// 各星のサイズは、基準サイズから -10, 0, +10, 0 を順に繰り返し適用
	const sizeVariations = [-10, 0, 10, 0]

	return (
		<div
			className="relative w-[18.75rem] h-[25rem]"
			style={{ perspective: '1000px' }}
		>
			{/* カード本体 */}
			<div ref={cardRef} className="w-full h-full transform-style-3d relative">
				{/* 表面 */}
				<div className="absolute w-full h-full backface-hidden">
					<img
						src={frontImage}
						alt="Card Front"
						className="w-full h-full object-cover"
						onLoad={handleImageLoad}
						decoding="auto"
					/>
				</div>
				{/* 裏面（rotateY-180で配置） */}
				<div className="absolute w-full h-full backface-hidden rotateY-180">
					<img
						src={backImage}
						alt="Card Back"
						className="w-full h-full object-cover"
						onLoad={handleImageLoad}
						decoding="auto"
					/>
				</div>
			</div>

			{/* キラキラエフェクト（対象レアリティの場合のみ表示） */}
			{['SUPER_RARE', 'SS_RARE', 'ULTRA_RARE', 'SECRET_RARE'].includes(
				rarity,
			) && (
				<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
					{/* SECRET以外はグラデーション定義を追加（globals.css等で別途定義しても可） */}
					{rarity !== 'SECRET_RARE' && (
						<svg width="0" height="0">
							<defs>
								<linearGradient
									id="goldGradient"
									x1="0%"
									y1="0%"
									x2="100%"
									y2="0%"
								>
									<stop
										offset="0%"
										style={{ stopColor: '#FFD700', stopOpacity: 1 }}
									/>
									<stop
										offset="100%"
										style={{ stopColor: '#FFB14E', stopOpacity: 1 }}
									/>
								</linearGradient>
							</defs>
						</svg>
					)}
					{fixedStarPositions.map((pos, index) => {
						const currentSize =
							starBaseSize + sizeVariations[index % sizeVariations.length]
						return (
							<Sparkle
								key={index}
								size={currentSize}
								color={starColor}
								style={{ position: 'absolute', ...pos }}
								className="sparkle-star"
							/>
						)
					})}
				</div>
			)}
		</div>
	)
}

export const GachaPickup = ({
	createType,
	version,
	delay,
}: {
	createType: GachaCreateType
	version: string
	delay?: number
}) => {
	const gacha = new Gacha(version)
	const [gachaData] = useState<{ data: GachaItem; name: RarityType }>(() =>
		gacha.pickRandomImage(),
	)
	const [res, setRes] = useState<ApiResponse<string>>()
	const hasCalled = useRef(false)

	useEffect(() => {
		if (hasCalled.current) return
		hasCalled.current = true
		;(async () => {
			const session = await getSession()
			setRes(
				await createUserGachaResultAction({
					userId: session?.user.id,
					gachaVersion: version,
					gachaRarity: gachaData.name,
					gachaSrc: gachaData.data.src,
					createType,
				}),
			)
		})()
	}, [gachaData, createType])

	if (!res) {
		return (
			<div className="flex flex-col items-center h-[25rem]">
				<div className="loading loading-spinner loading-lg my-auto"></div>
			</div>
		)
	} else if (res.status !== 201) {
		return (
			<div className="flex flex-col items-center h-[25rem]">
				<div className="text-lg text-seconday-main my-auto">
					今日はもうこれ以上引けません
				</div>
			</div>
		)
	} else {
		return (
			<div className="flex flex-col items-center h-[25rem]">
				<CardAnimation
					frontImage={gachaData.data.src}
					rarity={gachaData.name}
				/>
			</div>
		)
	}
}

const GachaPickupPopup = forwardRef<
	GachaPickupPopupRef,
	{
		createType: GachaCreateType
		version: string
		open: boolean
		onClose: () => void
	}
>(({ open, onClose, createType, version }, ref) => {
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
				<GachaPickup createType={createType} version={version} delay={1} />
				<button className="btn btn-outline" onClick={onClose}>
					閉じる
				</button>
			</div>
		</div>
	)
})

GachaPickupPopup.displayName = 'GachaPickupPopup'

export default GachaPickupPopup
