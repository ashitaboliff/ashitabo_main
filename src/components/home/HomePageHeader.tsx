'use client'

import LocalFont from 'next/font/local'
import { HomePageBar, HomePageBarSp } from '@/svg/home/HomePageBar'
import { useScreenSize, getMaxWidth } from '@/utils/ScreenSize'

const gkktt = LocalFont({
	src: '../../lib/fonts/851Gkktt_005.woff',
	weight: 'normal',
	style: 'normal',
	variable: '--851-gkktt',
})

const HomePageHeader = () => {
	const width = useScreenSize()
	const { device } = getMaxWidth(width)

	return (
		<div
			className={`flex flex-col items-center relative mb-8 ${gkktt.className}`}
		>
			<div className={`absolute w-full flex justify-center`}>
				{device === 'mobile' ? <HomePageBarSp /> : <HomePageBar />}
			</div>
			<div className="flex flex-col items-center justify-center mt-4 bg-bg-white bg-opacity-60 z-10">
				<div className={`text-xl whitespace-nowrap`}>
					信州大学工学部・教育学部・長野県立大学
				</div>
				<div className={`text-xl`}>軽音サークル</div>
				<div className={`text-7xl`}>あしたぼ</div>
			</div>
		</div>
	)
}

export default HomePageHeader
