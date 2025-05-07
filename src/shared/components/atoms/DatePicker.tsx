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
	minDate,
	errorMessage,
}: {
	label?: string
	selectedDate: Date | null
	onChange: (dates: Date | null) => void
	minDate?: Date
	errorMessage?: string
}) => {
	return (
		<div className="flex flex-col gap-y-2 w-full">
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
				minDate={minDate}
				dateFormat="yyyy/MM/dd"
				className="border border-base-300 rounded-md p-2 w-full"
				calendarClassName="bg-bg-white"
			/>
			{errorMessage && (
				<div className="label">
					<span className="label-text-alt text-error">{errorMessage}</span>
				</div>
			)}
		</div>
	)
}

export default CustomDatePicker
