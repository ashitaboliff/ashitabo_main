'use client'

import {
	useImperativeHandle,
	forwardRef,
	useState,
	useRef,
	useEffect,
} from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import GachaPickupPopup, {
	GachaPickupPopupRef,
} from '@/features/gacha/components/GachaPickupPopup'
import { gachaConfigs } from '@/features/gacha/components/config/gachaConfig'

export type GachaSelectPopupRef =
	| {
			show: () => void
			close: () => void
	  }
	| undefined

const packs = Object.entries(gachaConfigs)
	.filter(([, config]) => config.packImage)
	.map(([version, config]) => ({
		version,
		packImage: config.packImage as string,
	}))

const ImageCarousel = () => {
	const [currentIndex, setCurrentIndex] = useState<number>(packs.length - 1)
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const [gachaVersion, setGachaVersion] = useState<string>('version1')
	const [packViewed, setPackViewed] = useState<boolean>(false) // Initial state is false
	const ref = useRef<GachaPickupPopupRef>(undefined)

	useEffect(() => {
		// When currentIndex changes, immediately set packViewed to false
		// then set it to true after a delay to allow for transition/loading effect.
		setPackViewed(false)
		const timer = setTimeout(() => {
			setPackViewed(true)
		}, 300) // Adjusted delay to 300ms, can be tuned

		return () => clearTimeout(timer) // Cleanup timer on unmount or if currentIndex changes again
	}, [currentIndex])

	const updateIndex = (direction: 'next' | 'prev') => {
		if (direction === 'next' && currentIndex < packs.length - 1) {
			setCurrentIndex((prev) => prev + 1)
		} else if (direction === 'prev' && currentIndex > 0) {
			setCurrentIndex((prev) => prev - 1)
		}
	}

	const gachaPickup = () => {
		setGachaVersion(packs[currentIndex].version)
		setIsPopupOpen(true)
	}

	return (
		<div className="relative flex items-center justify-center w-full h-[600px] overflow-hidden select-none">
			<button
				className="absolute left-0 z-30 btn btn-ghost"
				onClick={() => updateIndex('prev')}
				disabled={currentIndex === 0}
			>
				{'<'}
			</button>

			{packViewed ? (
				<div className="relative flex items-center justify-center w-full">
					{currentIndex > 0 ? (
						<div
							className="absolute left-0 z-10 transform transition-transform"
							onClick={() => updateIndex('prev')}
						>
							<Image
								src={packs[currentIndex - 1].packImage}
								alt={`${packs[currentIndex - 1].version} pack`}
								width={110}
								height={200}
								decoding="auto"
							/>
						</div>
					) : (
						<div className="absolute left-0 w-[110px] h-[200px] z-10" />
					)}

					<div className="relative z-20 transform transition-transform">
						<Image
							src={packs[currentIndex].packImage}
							alt={`${packs[currentIndex].version} pack`}
							width={250}
							height={400}
							onClick={gachaPickup}
							decoding="auto"
						/>
						<div
							className="pack-text absolute left-0 w-full text-2xl font-bold bg-base-content/50 text-white text-center py-1 -translate-y-80 z-30"
							onClick={gachaPickup}
						>
							このパックを引く
						</div>
					</div>

					{currentIndex < packs.length - 1 ? (
						<div
							className="absolute right-0 z-10 transform transition-transform"
							onClick={() => updateIndex('next')}
						>
							<Image
								src={packs[currentIndex + 1].packImage}
								alt={`${packs[currentIndex + 1].version} pack`}
								width={110}
								height={200}
								decoding="auto"
							/>
						</div>
					) : (
						<div className="absolute right-0 w-[110px] h-[200px] z-10" />
					)}
				</div>
			) : (
				<div className="flex flex-col items-center h-[25rem]">
					<div className="loading loading-spinner loading-lg my-auto"></div>
				</div>
			)}

			<button
				className="absolute right-0 z-30 btn btn-ghost"
				onClick={() => updateIndex('next')}
				disabled={currentIndex === packs.length - 1}
			>
				{'>'}
			</button>
			{isPopupOpen && (
				<GachaPickupPopup
					ref={ref}
					open={isPopupOpen}
					onClose={() => setIsPopupOpen(false)}
					version={gachaVersion}
					createType="user"
				/>
			)}
		</div>
	)
}

const GachaSelectPopup = forwardRef<
	GachaSelectPopupRef,
	{
		open: boolean
		onClose: () => void
	}
>(({ open, onClose }, ref) => {
	useImperativeHandle(ref, () => ({
		show: () => {
			onClose()
		},
		close: () => {
			onClose()
		},
	}))

	return (
		<div className={clsx('modal', open && 'modal-open')} onClick={onClose}>
			<div
				className={clsx(
					'modal-box bg-base-100 rounded-lg shadow-lg py-4 px-1 flex flex-col gap-y-2 justify-center',
					'max-w-xl',
				)}
				onClick={(e) => e.stopPropagation()}
			>
				<ImageCarousel />
				<button className="btn btn-outline mx-2" onClick={onClose}>
					閉じる
				</button>
			</div>
		</div>
	)
})

GachaSelectPopup.displayName = 'GachaSelectPopup'

export default GachaSelectPopup
