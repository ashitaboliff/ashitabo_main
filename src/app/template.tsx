'use client'

import { ReactNode } from 'react'
import { useScreenSize, getMaxWidth } from '@/utils/ScreenSize'

export default function Template({ children }: { children: ReactNode }) {
	const width = useScreenSize()
	const { defaultSize } = getMaxWidth(width)

	return (
		<>
			<div className={`container mx-auto ${defaultSize} p-4`}>{children}</div>
		</>
	)
}
