'use clinet'

import { getYear, getMonth } from 'date-fns'

const CustomHeader = ({
	date,
	changeYear,
	changeMonth,
	decreaseMonth,
	increaseMonth,
	prevMonthButtonDisabled,
	nextMonthButtonDisabled,
}: {
	date: Date
	changeYear: (value: string) => void
	changeMonth: (value: string) => void
	decreaseMonth: () => void
	increaseMonth: () => void
	prevMonthButtonDisabled: boolean
	nextMonthButtonDisabled: boolean
}) => {
	const years = []
	const currentYear = getYear(new Date())
	for (let i = currentYear - 10; i <= currentYear + 10; i++) {
		years.push(i)
	}

	const months = [
		'1月',
		'2月',
		'3月',
		'4月',
		'5月',
		'6月',
		'7月',
		'8月',
		'9月',
		'10月',
		'11月',
		'12月',
	]

	return (
		<div className="flex justify-between items-center px-2 py-1">
			<button
				onClick={decreaseMonth}
				disabled={prevMonthButtonDisabled}
				className="text-gray-500 hover:text-gray-700"
			>
				{'<'}
			</button>
			<div className="flex items-center space-x-2">
				<select
					value={getYear(date)}
					onChange={({ target: { value } }) => changeYear(value)}
					className="border border-base-200 rounded-md p-1"
				>
					{years.map((option) => (
						<option key={option} value={option}>
							{option}年
						</option>
					))}
				</select>
				<select
					value={getMonth(date)}
					onChange={({ target: { value } }) => changeMonth(value)}
					className="border border-base-200 rounded-md p-1"
				>
					{months.map((option, index) => (
						<option key={option} value={index}>
							{option}
						</option>
					))}
				</select>
			</div>
			<button
				onClick={increaseMonth}
				disabled={nextMonthButtonDisabled}
				className="text-gray-500 hover:text-gray-700"
			>
				{'>'}
			</button>
		</div>
	)
}

export default CustomHeader
