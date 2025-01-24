'use client'

import Carousel from '@/components/home/HomeCarousel'
import HomeButton from '@/components/home/HomeButton'
import { useScreenSize, getMaxWidth } from '@/utils/ScreenSize'

const Page = () => {
	const width = useScreenSize()
	const { device } = getMaxWidth(width)
	return (
		<div>
			<Carousel />
			<div className="flex flex-col items-center justify-center bg-bg-white bg-opacity-60 z-10">
				<div className={`text-2xl whitespace-nowrap`}>
					信大＆県大のB1～M2が所属する
				</div>
				<div className={`text-2xl`}>軽音サークル♪</div>
				<div className={`text-2xl`}>長野市で活動しています！</div>
			</div>
			<HomeButton device={device} />
		</div>
	)
}

export default Page
