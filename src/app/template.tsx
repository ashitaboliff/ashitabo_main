'use server'

import { ReactNode } from 'react'

function Template({ children }: { children: ReactNode }) {
	return (
		<>
			<div className={`container mx-auto px-2 h-full`}>
				{children}
			</div>
		</>
	)
}

export default Template
