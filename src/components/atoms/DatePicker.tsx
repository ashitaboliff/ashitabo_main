'use client'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomHeader from '@/components/atoms/DatePickerCustumHeader'

import { registerLocale } from 'react-datepicker'
import { ja } from 'date-fns/locale'

registerLocale('ja', ja)

const CustomDatePicker = ({
	label,
	selectedDate,
	onChange,
}: {
	label?: string
	selectedDate: Date | null
	onChange: (dates: Date | null) => void
}) => {
	return (
		<div className="flex flex-row gap-y-2 items-center justify-around">
			{label && <label>{label}</label>}
			<DatePicker
				selected={selectedDate}
				onChange={onChange}
				locale="ja"
				withPortal
				renderCustomHeader={(props) => (
					<CustomHeader
						{...props}
						changeYear={(value: string) => props.changeYear(Number(value))}
						changeMonth={(value: string) => props.changeMonth(Number(value))}
					/>
				)}
				dateFormat="yyyy/MM/dd"
				className="border border-base-300 rounded-md p-2"
			/>
		</div>
	)
}

export default CustomDatePicker
