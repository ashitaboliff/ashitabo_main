'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<ProgressBar
				height="4px"
				color="#3C87E0"
				options={{ showSpinner: false }}
				shallowRouting
			/>
			{children}
		</>
	)
}

export default ProgressBarProvider
