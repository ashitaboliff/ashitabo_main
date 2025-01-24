'use client'

import { useState, useEffect } from 'react'

export const useScreenSize = () => {
	const [width, setWidth] = useState<number>(1024) // SSR環境ではデフォルト値を設定

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const handleResize = () => setWidth(window.innerWidth)
			setWidth(window.innerWidth) // 初期描画時に更新
			window.addEventListener('resize', handleResize)

			return () => {
				window.removeEventListener('resize', handleResize)
			}
		}
	}, [])

	return width
}

export const getMaxWidth = (
	width: number,
): { device: string; defaultSize: string } => {
	let device = 'mobile'
	let defaultSize = 'max-w-sm'

	if (width < 768) {
		device = 'mobile'
		defaultSize = 'max-w-sm'
	} else if (width < 1024) {
		device = 'tablet'
		defaultSize = 'max-w-md'
	} else {
		device = 'desktop'
		defaultSize = 'max-w-lg'
	}

	return { device, defaultSize }
}
