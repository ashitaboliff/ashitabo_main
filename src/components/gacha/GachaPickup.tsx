'use client'

import { useState, useImperativeHandle, forwardRef } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import clsx from 'clsx'
import gachaList from '@/components/gacha/version1List'
import { GachaListItem } from '@/types/GachaTypes'

export type GachaPickupRef =
	| {
			show: () => void
			close: () => void
	  }
	| undefined

const GachaPickup = forwardRef<
	GachaPickupRef,
	{
		open: boolean
		onClose: () => void
	}
>(({ open, onClose }, ref) => {
	useImperativeHandle(ref, () => ({
		show: () => onClose(),
		close: () => onClose(),
	}))

	const pickRandomImage = () => {
		const categories = [
			gachaList.common,
			gachaList.rare,
			gachaList.superRare,
			gachaList.ssRare,
			gachaList.ultraRare,
			gachaList.secretRare,
		]
		const total = categories.reduce(
			(sum, cat) => sum + cat.late * cat.data.length,
			0,
		)
		const r = Math.floor(Math.random() * total)
		let accum = 0
		for (const cat of categories) {
			const size = cat.late * cat.data.length
			if (r < accum + size) {
				const index = (r - accum) % cat.data.length
				return { data: cat.data[index], name: cat.name }
			}
			accum += size
		}
		return { data: categories[0].data[0], name: categories[0].name }
	}

	const { data, name } = pickRandomImage()

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

				<div className="w-full h-full flex justify-center items-center">
					<motion.div
						className="w-auto h-auto relative z-50"
						animate={{
							rotateY: 360, // Y軸で360度回転
							transition: {
								duration: 1,
								ease: 'easeInOut',
								rotateY: {
									repeat: 0,
									duration: 4,
								},
							},
						}}
					>
						<Image
							src={data.src}
							alt={`ガチャ結果${name}-${data.id}`}
							width={300}
							height={400}
						/>
					</motion.div>
				</div>
				<button className="btn btn-outline" onClick={onClose}>
					閉じる
				</button>
			</div>
		</div>
	)
})

export default GachaPickup
