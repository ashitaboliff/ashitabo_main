import { useState, useEffect, useRef, ReactNode } from 'react'
import { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form'
import LabelInputField from '@/components/atoms/LabelInputField'

interface SelectFieldProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {
	register?: UseFormRegisterReturn
	options: Record<string, string> // key-value形式で表示するオプション
	label?: string // ラベルをオプションで追加
	isMultiple?: boolean // multiple選択を許可するかどうか
	setValue?: UseFormSetValue<any> // react-hook-formのsetValue
	watchValue?: any[] // 現在の選択値をwatchする
	name: string // フォームフィールドの名前
	infoDropdown?: ReactNode // ドロップダウンの情報
	errorMessage?: string // エラーメッセージ
}

/**
 * セレクトボックス
 * @param register react-hook-formのregister
 * @param options key-value形式で表示するオプション
 * @param label ラベル
 * @param isMultiple multiple選択を許可するかどうか
 * @param setValue react-hook-formのsetValue
 * @param watchValue 現在の選択値をwatchする
 * @param name フォームフィールドの名前
 * @param props その他のprops
 */
const SelectField = ({
	register,
	options,
	label,
	isMultiple = false,
	setValue,
	watchValue = [],
	name,
	infoDropdown,
	errorMessage,
	...props
}: SelectFieldProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false) // メニューの開閉状態
	const dropdownRef = useRef<HTMLDivElement>(null)

	const handleCheckboxChange = (key: string) => {
		if (!setValue) return

		const newValue = watchValue.includes(key)
			? watchValue.filter((item) => item !== key)
			: [...watchValue, key]

		setValue(name, newValue)
	}

	const toggleDropdown = () => setIsOpen((prev) => !prev)

	// メニューの外側をクリックしたときにメニューを閉じる
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		} else {
			document.removeEventListener('mousedown', handleClickOutside)
		}

		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen])

	return (
		<div className="form-control w-full max-w-xs" ref={dropdownRef}>
			{label && <LabelInputField label={label} infoDropdown={infoDropdown} />}
			{isMultiple ? (
				<div className={`dropdown ${isOpen ? 'dropdown-open' : ''}`}>
					<div
						tabIndex={0}
						role="button"
						className={`btn btn-primary m-1 ${watchValue.length !== 0 ? 'btn-outline' : ''}`}
						onClick={toggleDropdown} // クリックで開閉を切り替え
					>
						{watchValue.length === 0
							? '選択してください'
							: watchValue.map((key) => options[key]).join(', ')}
					</div>
					{isOpen && (
						<div className="dropdown-content bg-bg-white menu space-y-2 rounded-box z-[1] w-52 p-2 shadow">
							{Object.entries(options).map(([key, value]) => (
								<label
									key={`label-${key}`}
									className="flex items-center space-x-2 cursor-pointer"
								>
									<input
										key={`input-${key}`}
										type="checkbox"
										checked={watchValue.includes(key)} // 現在の選択をwatch
										onChange={() => handleCheckboxChange(key)}
										className="checkbox checkbox-primary"
									/>
									<span key={`span-${key}`} className="label-text">
										{value}
									</span>
								</label>
							))}
						</div>
					)}
				</div>
			) : (
				<select
					className="select select-bordered w-full max-w-xs"
					{...register}
					{...props}
					{...(props.value ? {} : { defaultValue: '' })}
				>
					<option value="" disabled hidden>
						選択してください
					</option>
					{Object.entries(options).map(([key, value]) => (
						<option key={value} value={key}>
							{value}
						</option>
					))}
				</select>
			)}
			{errorMessage && (
				<div className="label">
					<span className="label-text-alt text-error">{errorMessage}</span>
				</div>
			)}
		</div>
	)
}

export default SelectField
