'use client'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { getGitImageUrl } from '@/utils'

type Petal = {
	left: number
	top: number
	hue: number
}

const Page = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const centerImgRef = useRef<HTMLImageElement>(null)
	const textRef = useRef<HTMLDivElement>(null)
	// 初期レンダリング時にpetalsを生成
	const [petals] = useState<Petal[]>(() =>
		Array.from({ length: 20 }).map(() => ({
			left: Math.random() * 100,
			top: Math.random() * 100,
			hue: Math.random() * 360,
		})),
	)

	useEffect(() => {
		// 背景グラデーションのアニメーション
		if (containerRef.current) {
			gsap.to(containerRef.current, {
				backgroundPosition: '200% 0',
				duration: 10,
				repeat: -1,
				ease: 'linear',
			})
		}

		// 中央画像の連続回転
		if (centerImgRef.current) {
			gsap.to(centerImgRef.current, {
				rotation: 360,
				duration: 5,
				repeat: -1,
				ease: 'linear',
			})
		}

		// 卒業テキストのスケールアニメーション
		if (textRef.current) {
			gsap.to(textRef.current, {
				scale: 1.2,
				duration: 0.8,
				yoyo: true,
				repeat: -1,
				ease: 'power1.inOut',
			})
		}

		// 画面四隅の画像のx,y,z軸回転アニメーション
		gsap.utils.toArray('.corner-image').forEach((el: any) => {
			gsap.to(el, {
				rotationX: 360,
				rotationY: 360,
				rotationZ: 360,
				duration: 10,
				repeat: -1,
				ease: 'linear',
			})
		})

		// 花吹雪のSVG要素に対してGSAPアニメーションを設定
		const petalAnimations = gsap.utils.toArray('.petal').map((el: any) => {
			return gsap.to(el, {
				y: '100vh',
				duration: Math.random() * 7 + 3, // 3〜10秒程度の流れ
				ease: 'linear',
				repeat: -1,
				delay: Math.random() * 2,
				onRepeat: function () {
					// 繰り返し毎に上部にリセット
					gsap.set(el, { y: -50 })
				},
			})
		})

		// Cleanup function
		const currentContainerRef = containerRef.current
		const currentCenterImgRef = centerImgRef.current
		const currentTextRef = textRef.current
		return () => {
			if (currentContainerRef) gsap.killTweensOf(currentContainerRef)
			if (currentCenterImgRef) gsap.killTweensOf(currentCenterImgRef)
			if (currentTextRef) gsap.killTweensOf(currentTextRef)
			gsap.killTweensOf('.corner-image')
			petalAnimations.forEach((anim) => anim.kill())
		}
	}, [])

	return (
		<div
			ref={containerRef}
			style={{
				position: 'relative',
				width: '100vw',
				height: '100vh',
				overflow: 'hidden',
				background:
					'linear-gradient(270deg, red, orange, yellow, green, blue, indigo, violet)',
				backgroundSize: '400% 400%',
			}}
		>
			{/* 背景で舞うSVG（花吹雪） */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					pointerEvents: 'none',
				}}
			>
				{petals.map((petal, i) => (
					<svg
						key={i}
						className="petal"
						width="20"
						height="20"
						style={{
							position: 'absolute',
							left: `${petal.left}%`,
							top: `${petal.top}%`,
						}}
						viewBox="0 0 100 100"
					>
						<circle
							cx="50"
							cy="50"
							r="20"
							fill={`hsl(${petal.hue}, 100%, 50%)`}
						/>
					</svg>
				))}
			</div>

			{/* 画面中央の画像（回転） */}
			<Image
				ref={centerImgRef}
				src={getGitImageUrl("/shikishi/ume1.png")}
				alt="center"
				width={300}
				height={300}
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				}}
			/>

			{/* 画像の上に表示されるテキスト（卒業おめでとう） */}
			<div
				ref={textRef}
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					fontSize: '24px',
					fontWeight: 'bold',
					color: 'black',
					WebkitTextStroke: '1px white',
					textAlign: 'center',
				}}
			>
				うめもとさん卒業おめでとう！
			</div>

			{/* 画面四隅の画像（各角でx,y,z軸回転） */}
			<Image
				className="corner-image"
				src={getGitImageUrl("/shikishi/ume2.png")}
				alt="corner"
				style={{ position: 'absolute', top: 0, right: 0 }}
				width={100}
				height={100}
			/>
			<Image
				className="corner-image"
				src={getGitImageUrl("/shikishi/ume3.png")}
				alt="corner"
				style={{ position: 'absolute', bottom: 0, left: 0 }}
				width={100}
				height={100}
			/>
		</div>
	)
}

export default Page
