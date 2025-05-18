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
import { ApiResponse } from '@/utils/types/responseTypes'
import { getGitImageUrl } from '@/utils'

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
	rarity: RarityType // レアリティに応じてアニメーションを変更するため追加
}
const Sparkle = ({
	size,
	color,
	style = {},
	className,
	rarity,
}: SparkleProps) => {
	const sparkleRef = useRef<SVGSVGElement>(null)

	useEffect(() => {
		if (!sparkleRef.current) return
		let sparkleAnimSpeed = 0.8
		let sparkleScale = 1.5
		if (rarity === 'ULTRA_RARE' || rarity === 'SECRET_RARE') {
			sparkleAnimSpeed = 0.5
			sparkleScale = 2.0
		} else if (rarity === 'SS_RARE') {
			sparkleAnimSpeed = 0.6
			sparkleScale = 1.8
		}

		const tween = gsap.to(sparkleRef.current, {
			opacity: gsap.utils.random(0.3, 0.8),
			scale: gsap.utils.random(sparkleScale * 0.8, sparkleScale * 1.2),
			rotation: gsap.utils.random(-30, 30),
			duration: sparkleAnimSpeed,
			yoyo: true,
			repeat: -1,
			ease: 'power1.inOut',
			delay: gsap.utils.random(0, 0.5), // 個々の星にランダムな遅延を追加
		})
		return () => {
			tween.kill()
		}
	}, [rarity])

	return (
		<svg
			ref={sparkleRef}
			width={size}
			height={size}
			style={style}
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
	const effectContainerRef = useRef<HTMLDivElement>(null) // エフェクト用コンテナ
	const [imagesLoaded, setImagesLoaded] = useState<number>(0)
	const backImage = getGitImageUrl('gacha/backimage.png')
	const frontImageUrl = getGitImageUrl(frontImage)

	// 画像が読み込まれたらカウントアップ
	const handleImageLoad = () => {
		setImagesLoaded((prev) => prev + 1)
	}

	useEffect(() => {
		if (!cardRef.current || imagesLoaded < 2 || !effectContainerRef.current)
			return

		let timeoutId: NodeJS.Timeout | null = null
		const masterTimeline = gsap.timeline() // メインのタイムライン

		const initialDelay = delay || 0

		// 初期表示 (SECRET_RARE以外の場合)
		if (rarity !== 'SECRET_RARE') {
			masterTimeline.to(cardRef.current, { opacity: 1, duration: 0.5 }, initialDelay)
		}

		// カード本体のアニメーション（レアリティに応じた処理）
		const cardElement = cardRef.current
		const effectsContainer = effectContainerRef.current

		// アニメーション終了後にクリーンアップ
		const cleanupEffects = () => {
			gsap.killTweensOf(cardElement)
			gsap.killTweensOf('.sparkle-star')
			gsap.killTweensOf('.light-ray-effect')
			gsap.killTweensOf('.particle-effect')
			if (effectsContainer) {
				effectsContainer.innerHTML = '' // 動的に追加した要素を削除
			}
		}

		if (rarity === 'COMMON') {
			masterTimeline.to(
				cardElement,
				{
					scale: 1.05,
					duration: 0.3,
					yoyo: true,
					repeat: 1,
					ease: 'power1.inOut',
				},
				'>',
			)
			masterTimeline.fromTo(
				cardElement,
				{ boxShadow: '0 0 0px 0px rgba(200,200,200,0)' },
				{
					boxShadow: '0 0 15px 5px rgba(200,200,200,0.7)',
					duration: 0.2,
					yoyo: true,
					repeat: 1,
				},
				'<',
			)
		} else if (rarity === 'RARE') {
			masterTimeline.to(
				cardElement,
				{ rotationY: 360, duration: 1.5, ease: 'power2.inOut' },
				'>',
			)
			masterTimeline.fromTo(
				cardElement.querySelectorAll<HTMLDivElement>('.backface-hidden'), // Apply to front/back divs
				{ 
					boxShadow: '0 0 0px 0px rgba(100,100,255,0)',
					borderRadius: '1.7rem',
				},
				{
					boxShadow: '0 0 20px 8px rgba(100,100,255,0.7)',
					duration: 0.4,
					yoyo: true,
					repeat: 3,
					delay: 0.5,
					borderRadius: '1.7rem',
				},
				'<0.5',
			)
		} else if (rarity === 'SUPER_RARE') {
			masterTimeline
				.to(
					cardElement,
					{ x: '-=5', yoyo: true, repeat: 5, duration: 0.05 },
					'>',
				)
				.to(
					cardElement,
					{ x: '+=5', yoyo: true, repeat: 5, duration: 0.05 },
					'<',
				) // 揺れ
				.to(
					cardElement,
					{ rotationY: 360, duration: 1, ease: 'power3.inOut' },
					'+=0.1',
				) // 回転
				.fromTo(
					cardElement.querySelectorAll<HTMLDivElement>('.backface-hidden'), // Apply to front/back divs
					{ 
						boxShadow: '0 0 0px 0px rgba(255,215,0,0)',
						borderRadius: '1.7rem', 
					},
					{
						boxShadow: '0 0 30px 12px rgba(255,215,0,0.8)',
						duration: 0.5,
						yoyo: true,
						repeat: 3,
						borderRadius: '1.7rem', // Assuming card images have this border-radius
					},
					'-=0.5',
				) // 金色のグロー
		} else if (rarity === 'SS_RARE') {
			masterTimeline
				.to(cardElement, { scale: 1.1, duration: 0.2, ease: 'power1.in' }, '>')
				.to(
					cardElement,
					{ x: '-=8', yoyo: true, repeat: 7, duration: 0.04 },
					'<0.1',
				)
				.to(
					cardElement,
					{ x: '+=8', yoyo: true, repeat: 7, duration: 0.04 },
					'<',
				) // ズームと揺れ
				.to(
					cardElement,
					{ rotationY: 720, rotationX: 360, duration: 1.5, ease: 'expo.inOut' },
					'+=0.1',
				) // 多軸回転
				.to(cardElement, { scale: 1.0, duration: 0.3, ease: 'power1.out' }) // スケール戻し

			// 光線エフェクト
			for (let i = 0; i < 8; i++) {
				const ray = document.createElement('div')
				ray.className = 'light-ray-effect' // CSSでスタイル定義
				effectsContainer.appendChild(ray)
				masterTimeline.fromTo(
					ray,
					{
						opacity: 0,
						scaleY: 0,
						rotation: gsap.utils.random(0, 360),
						x: '50%', // 中央基点
						y: '50%', // 中央基点
						transformOrigin: '0% 0%', // 回転軸を先端に
					},
					{
						opacity: 1,
						scaleY: 1,
						duration: 0.5,
						ease: 'power2.out',
						stagger: 0.1,
						onComplete: () => ray.remove(),
					},
					'-=1.0',
				)
			}
		} else if (rarity === 'ULTRA_RARE') {
			masterTimeline.fromTo(
				cardElement,
				{ scale: 0.2, opacity: 0, duration: 0.5, ease: 'power3.out' }, // Corrected opacity from 2 to 0
				{ scale: 1, duration: 0.3, opacity: 1 , ease: 'power1.in' },
				'>+0.1',
			)


			// 衝撃波 (専用のdivを生成)
			// const shockwave = document.createElement('div')
			// shockwave.className = 'shockwave-effect' // CSSでスタイル定義
			// effectsContainer.appendChild(shockwave)
			// masterTimeline.fromTo(
			// 	shockwave,
			// 	{ scale: 0.5, opacity: 0, borderWidth: '0px' },
			// 	{
			// 		scale: 2.5,
			// 		opacity: 1,
			// 		borderWidth: '50px', // 枠線の太さをアニメーション
			// 		borderColor: 'rgba(255,223,186,0.7)',
			// 		duration: 0.7,
			// 		ease: 'expo.out',
			// 		onComplete: () => shockwave.remove(),
			// 	},
			// 	'-=0.3',
			// )

			masterTimeline
				.to(
					cardElement,
					{ rotationY: 1080, duration: 2, ease: 'expo.inOut' },
					'>',
				)
				.to(
					cardElement,
					{
						boxShadow: '0 0 60px 30px rgba(255,255,150,1)',
						yoyo: true,
						repeat: 3,
						duration: 0.3,
						borderRadius: '2rem',
					},
					'-=1.5',
				) // 高速回転と強い発光

			// 光の粒子エフェクト
			for (let i = 0; i < 30; i++) {
				const particle = document.createElement('div')
				particle.className = 'particle-effect ultra-particle' // CSSでスタイル定義
				effectsContainer.appendChild(particle)
				masterTimeline.fromTo(
					particle,
					{
						x: '50%',
						y: '50%',
						opacity: 1,
						scale: gsap.utils.random(0.5, 1.2),
					},
					{
						x: `random(-200, 200)%`, // ランダムな方向に飛散
						y: `random(-200, 200)%`,
						opacity: 0,
						scale: 0,
						duration: gsap.utils.random(0.8, 1.5),
						ease: 'power3.out',
						onComplete: () => particle.remove(),
					},
					'-=1.8',
				)
			}
		} else if (rarity === 'SECRET_RARE') {
			// SECRET_RAREでは、まずカードを非表示・縮小状態にセット
			masterTimeline.set(cardElement, { opacity: 0, scale: 0.5 });

			const parentElement = cardElement.parentElement?.parentElement; // GachaPickupPopupのmodal-box想定

			if (parentElement) {
				masterTimeline.fromTo(
					parentElement,
					{ backgroundColor: 'rgba(255,255,255,0)' }, // fromVars
					{ // toVars
						backgroundColor: 'rgba(255,255,255,1)',
						duration: 0.1,
						yoyo: true,
						repeat: 1,
						onStart: () => {
							if (parentElement) parentElement.style.zIndex = '1000';
						}, // 一時的に最前面に
						onComplete: () => {
							if (parentElement) parentElement.style.zIndex = '';
						}, // zIndexを戻す
					},
					initialDelay // フラッシュをまず開始
				);
				'>';
			}

			if (parentElement) {
				masterTimeline.to( // カード登場 (フラッシュ後)
					cardElement,
					1, // duration
					{ // vars
						opacity: 1, // 0から1へ
						scale: 1,   // 0.5から1へ
						ease: 'power4.out',
					},
					'>' // position
				);
			} else {
				masterTimeline.to( // カード登場 (initialDelayで開始)
					cardElement,
					1, // duration
					{ // vars
						opacity: 1, // 0から1へ
						scale: 1,   // 0.5から1へ
						ease: 'power4.out',
					},
					initialDelay // position
				);
			}

			masterTimeline.to( // ズーム (スケールを1.2にしてから元に戻すyoyoエフェクト)
					cardElement,
					{
						scale: 1.2,
						duration: 0.5,
						ease: 'power1.inOut',
						yoyo: true, 
						repeat: 1,  
					},
					'>'
				)
				.to(cardElement, { // 荘厳な回転 (前のスケールアニメーション完了後)
					rotationY: 360,
					duration: 4,
					ease: 'power1.inOut',
					repeat: -1, 
				}, '>') 
				.to( // 脈動するオーラ (回転と同時に開始)
					cardElement,
					{
						boxShadow:
							'0 0 60px 30px rgba(0,0,0,0.8)', 
						yoyo: true,
						repeat: -1,
						duration: 1.5,
						ease: 'sine.inOut',
						borderRadius: '2rem',
					},
					'<' 
				);

			const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff8800', '#00ff88']
			for (let i = 0; i < 50; i++) {
				const particle = document.createElement('div')
				particle.className = 'particle-effect secret-particle' // CSSでスタイル定義
				particle.style.backgroundColor =
					colors[Math.floor(Math.random() * colors.length)]
				effectsContainer.appendChild(particle)
				masterTimeline.fromTo(
					particle,
					{
						x: '50%',
						y: '50%',
						opacity: 1,
						scale: gsap.utils.random(0.8, 1.5),
					},
					{
						x: `random(-250, 250)%`,
						y: `random(-250, 250)%`,
						rotation: 'random(0, 360)',
						opacity: 0,
						scale: 0,
						duration: gsap.utils.random(1.5, 2.5),
						ease: 'power2.out',
						onComplete: () => particle.remove(),
					},
					'-=3.5',
				)
			}
		}

		// 星の共通アニメーションはSparkleコンポーネント内で処理

		// タイムアウト処理
		if (delay) {
			timeoutId = setTimeout(() => {
				// masterTimeline.play() は不要、GSAPタイムラインは自動再生
			}, delay)
		}

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
			masterTimeline.kill() // メインタイムラインをkill
			cleanupEffects() // エフェクト要素のクリーンアップ
		}
	}, [rarity, imagesLoaded, delay])

	// レアリティに合わせた基準サイズ設定
	// SUPER_RAREは15、それ以外は20
	const starBaseSize = rarity === 'SUPER_RARE' ? 15 : 20
	// SECRETの場合は色はそのまま黒、その他はグラデーション（金色）
	const starColor = rarity === 'SECRET_RARE' ? '#000' : '#FFD700'

	// 固定の40個の星の表示位置（中央を避け、カードなど他の要素と重ならないよう端部に配置）
	const fixedStarPositions = useMemo(() => {
		const positions = []
		const numStars =
			rarity === 'ULTRA_RARE' || rarity === 'SECRET_RARE'
				? 60
				: rarity === 'SS_RARE'
					? 50
					: 40
		for (let i = 0; i < numStars; i++) {
			// よりランダムかつ広範囲に星を配置
			const side = Math.floor(Math.random() * 4) // 0: top, 1: bottom, 2: left, 3: right
			let pos: React.CSSProperties = {}
			const offset = `${Math.random() * 25}%` // 端からの距離
			const mainPos = `${Math.random() * 100}%` // 主軸上の位置

			if (side === 0) pos = { top: offset, left: mainPos }
			else if (side === 1) pos = { bottom: offset, left: mainPos }
			else if (side === 2) pos = { left: offset, top: mainPos }
			else pos = { right: offset, top: mainPos }
			positions.push(pos)
		}
		return positions
	}, [rarity])

	// 各星のサイズは、基準サイズから -10, 0, +10, 0 を順に繰り返し適用
	const sizeVariations = [-10, 0, 10, 0]

	return (
		<div
			className="relative w-[18.75rem] h-[25rem]"
			style={{ perspective: '1000px' }}
		>
			{/* エフェクト用コンテナ */}
			<div
				ref={effectContainerRef}
				className="absolute inset-0 pointer-events-none z-10 overflow-hidden" // overflow-hiddenを追加
			/>
			{/* カード本体 */}
			<div
				ref={cardRef}
				className="w-full h-full transform-style-3d relative opacity-0" // 初期opacityを0に
			>
				{/* 表面 */}
				<div className="absolute w-full h-full backface-hidden rounded-lg overflow-hidden">
					<img
						src={frontImageUrl}
						alt="Card Front"
						className="w-full h-full object-cover" // h-auto to h-full
						onLoad={handleImageLoad}
						decoding="auto"
					/>
				</div>
				{/* 裏面（rotateY-180で配置） */}
				<div className="absolute w-full h-full backface-hidden rotateY-180 rounded-lg overflow-hidden">
					<img
						src={backImage}
						alt="Card Back"
						className="w-full h-full object-cover" // h-auto to h-full
						onLoad={handleImageLoad}
						decoding="auto"
					/>
				</div>
			</div>

			{/* キラキラエフェクト（対象レアリティの場合のみ表示） */}
			{['SUPER_RARE', 'SS_RARE', 'ULTRA_RARE', 'SECRET_RARE'].includes(
				rarity,
			) && (
				<div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
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
								style={{ position: 'absolute', ...pos, opacity: 0 }} // 初期opacityを0に
								className="sparkle-star"
								rarity={rarity}
							/>
						)
					})}
				</div>
			)}
		</div>
	)
}

export const GachaPickup = ({
	version,
	delay,
	userId,
	onGachaSuccess, // onGachaSuccess を props で受け取る
}: {
	version: string
	delay?: number
	userId?: string // userId の型定義
	onGachaSuccess?: () => void // onGachaSuccess の型定義
}) => {
	const gacha = new Gacha(version)
	const [gachaData] = useState<{ data: GachaItem; name: RarityType }>(() =>
		gacha.pickRandomImage(),
	)
	const [res, setRes] = useState<ApiResponse<string>>()
	const hasCalled = useRef(false)

	useEffect(() => {
		if (hasCalled.current || !userId) return
		hasCalled.current = true
		;(async () => {
			const result = await createUserGachaResultAction({
				userId: userId,
				gachaVersion: version,
				gachaRarity: gachaData.name,
				gachaSrc: gachaData.data.src,
			})
			setRes(result)
			if (result.status === 201 && onGachaSuccess) {
				onGachaSuccess() // 成功時にコールバックを実行
			}
			console.log(result)
		})()
	}, [gachaData, version, userId, onGachaSuccess])

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
		version: string
		open: boolean
		onClose: () => void
		userId?: string // userId を props で受け取る
		onGachaSuccess?: () => void // onGachaSuccess を props で受け取る
	}
>(({ open, onClose, version, userId, onGachaSuccess }, ref) => {
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
				<GachaPickup
					version={version}
					delay={1}
					userId={userId} // userId を渡す
					onGachaSuccess={onGachaSuccess} // onGachaSuccess を渡す
				/>
				<button className="btn btn-outline" onClick={onClose}>
					閉じる
				</button>
			</div>
		</div>
	)
})

GachaPickupPopup.displayName = 'GachaPickupPopup'

export default GachaPickupPopup
