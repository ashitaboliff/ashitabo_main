'use server'

const lightBlue = '#3C87E0'
const lightyellow = '#F0CB51'
const lightred = '#E3646B'

import HomePageButton from '@/svg/home/HomePageButton'

const HomeButton = async () => {
	return (
		<div className="grid gap-4 pt-2 grid-cols-1 md:grid-cols-2 xl:scale-150 xl:origin-top">
			{/* Row 1 */}
			<div className="relative flex flex-row justify-center xl:justify-end w-auto h-36">
				<div className="absolute place-items-end -z-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						width="370"
						height="144"
						viewBox="0 0 370 144"
					>
						<rect x="97" y="0" width="13" height="71" fill={lightred} />
						<rect x="227" y="0" width="13" height="71" fill={lightBlue} />
						<rect x="240" y="0" width="117" height="13" fill={lightyellow} />
						<rect x="357" y="0" width="13" height="71" fill={lightBlue} />
					</svg>
				</div>
				{/* Buttons */}
				<div className="absolute flex flex-row gap-5">
					<HomePageButton
						color="lightred"
						text="活動紹介"
						link="/home/activity"
						patting="pt-4"
					/>
					<HomePageButton
						color="lightyellow"
						text="ライブ情報"
						link="/home/live"
						patting="pt-4"
					/>
					<HomePageButton
						color="lightBlue"
						text="過去映像"
						link="/video"
						patting="pt-4"
					/>
				</div>
			</div>

			{/* Row 2 */}
			<div className="relative flex flex-row justify-center xl:justify-start w-auto h-36">
				<div className="absolute place-items-end -z-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						width="370"
						height="144"
						viewBox="0 0 370 144"
					>
						<rect x="0" y="49" width="13" height="80" fill={lightred} />
						<rect x="13" y="116" width="117" height="13" fill={lightBlue} />
						<rect x="130" y="49" width="13" height="80" fill={lightred} />
						<rect x="260" y="49" width="13" height="80" fill={lightyellow} />
					</svg>
				</div>
				{/* Buttons */}
				<div className="absolute flex flex-row gap-5">
					<HomePageButton
						color="lightyellow"
						text="コマ表予約"
						link="/booking"
						patting="pb-4"
					/>
					<HomePageButton
						color="lightBlue"
						text="comingsoon"
						link="/home"
						patting="pb-4"
					/>
					<HomePageButton
						color="lightred"
						text="comingsoon"
						link="/home"
						patting="pb-4"
					/>
				</div>
			</div>
		</div>
	)
}

export default HomeButton
