const lightBlue = '#3C87E0'
const lightyellow = '#F0CB51'
const lightred = '#E3646B'

const colorList = [
	{ name: 'lightyellow', color: lightyellow },
	{ name: 'lightred', color: lightred },
	{ name: 'lightBlue', color: lightBlue },
]

const HomePageButton = ({
	color,
	link,
	text,
	patting,
}: {
	color: string
	link: string
	text: string
	patting?: string
}) => {
	const maxCharsPerLine = 6 // 1行に収まる文字数
	const lines = text.match(new RegExp(`.{1,${maxCharsPerLine}}`, 'g')) || [text]

	return (
		<a href={link} className={`cursor-pointer ${patting}`}>
			<svg
				width="110"
				height="110"
				viewBox="0 0 110 110"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="cursor-pointer"
			>
				<circle
					cx="55"
					cy="55"
					r="55"
					transform="rotate(180 55 55)"
					fill={colorList.find((c) => c.name === color)?.color}
				/>
				<text
					x="50%"
					y="50%"
					textAnchor="middle"
					dominantBaseline="middle"
					fill="black"
					fontSize="22"
				>
					{lines.map((line, index) => (
						<tspan
							key={index}
							x="50%"
							dy={`${lines.length !== 1 ? (index === 0 ? '-0.6em' : '1.2em') : '0'}`}
						>
							{line}
						</tspan>
					))}
				</text>
			</svg>
		</a>
	)
}

export default HomePageButton
