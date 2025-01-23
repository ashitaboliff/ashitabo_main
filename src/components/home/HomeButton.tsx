'use client'

const lightBlue = '#3C87E0'
const lightyellow = '#F0CB51'
const lightred = '#E3646B'

import HomePageButton from '@/svg/home/HomePageButton'

const HomeButton = ({
	device,
	font,
	width,
}: {
	device: string
	font: string
	width: number
}) => {
	return (
		<div
			className={`grid gap-4 pt-2 p-6 ${device === 'mobile' ? 'grid-cols-3' : 'grid-cols-6'} ${font}`}
		>
			<div className="relative flex flex-row justify-center">
				<div className="absolute place-items-end -z-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						width="200"
						height="200"
						viewBox="0 0 200 200"
					>
						<rect x="142" y="-22" width="13" height="100" fill={lightred} />
					</svg>
				</div>
				<HomePageButton
					color="lightred"
					text="活動紹介"
					link="/booking"
					patting="pt-4"
				/>
			</div>
			<div className="relative flex flex-row justify-center">
				<div className="absolute place-items-end -z-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						width="370"
						height="200"
						viewBox="0 0 370 200"
					>
						<rect x="227" y="-22" width="13" height="100" fill={lightBlue} />
						<rect
							x="240"
							y="0"
							width={width / 3.8}
							height="13"
							fill={lightyellow}
						/>
					</svg>
				</div>
				<HomePageButton
					color="lightyellow"
					text="ライブ情報"
					link="/booking"
					patting="pt-4"
				/>
			</div>
			<div className="relative flex flex-row justify-center">
				<div className="absolute place-items-end -z-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						width="150"
						height="150"
						viewBox="0 0 150 150"
					>
						<rect x="117" y="-22" width="13" height="100" fill={lightBlue} />
					</svg>
				</div>
				<HomePageButton
					color="lightBlue"
					text="過去映像"
					link="/booking"
					patting="pt-4"
				/>
			</div>
			<div className="relative flex flex-row justify-center">
				<div className="absolute place-items-end -z-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						width="200"
						height="200"
						viewBox="0 0 200 200"
					>
						<rect x="45" y="61" width="13" height="80" fill={lightred} />
						<rect
							x="58"
							y="128"
							width={width / 3.7}
							height="13"
							fill={lightBlue}
						/>
					</svg>
				</div>
				<HomePageButton
					color="lightyellow"
					text="ライブ情報"
					link="/booking"
					patting="pb-4"
				/>
			</div>
			<div className="relative flex flex-row justify-center">
				<div className="absolute place-items-end -z-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						width="150"
						height="150"
						viewBox="0 0 150 150"
					>
						<rect x="20" y="61" width="13" height="80" fill={lightred} />
					</svg>
				</div>
				<HomePageButton
					color="lightBlue"
					text="comingsoon"
					link="/home"
					patting="pb-4"
				/>
			</div>
			<div className="relative flex flex-row justify-center">
				<div className="absolute place-items-end -z-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						width="150"
						height="150"
						viewBox="0 0 150 150"
					>
						<rect x="20" y="61" width="13" height="80" fill={lightyellow} />
					</svg>
				</div>
				<HomePageButton
					color="lightred"
					text="comingsoon"
					link="/home"
					patting="pb-4"
				/>
			</div>
		</div>
	)
}

export default HomeButton
