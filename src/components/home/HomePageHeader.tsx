'use client'

import { HomePageBar, HomePageBarSp } from '@/svg/home/HomePageBar'
import { useScreenSize, getMaxWidth } from '@/utils/ScreenSize'

const HomePageHeader = () => {
	const width = useScreenSize()
	const { device } = getMaxWidth(width)

	return (
		<div className="flex flex-col items-center relative">
			<div className={`absolute w-full place-items-center`}>
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
