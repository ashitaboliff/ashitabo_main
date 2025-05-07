import { useState, useEffect, useRef, ReactNode } from 'react'
import { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form'
import LabelInputField from '@/components/atoms/LabelInputField'

interface SelectFieldProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {
	register?: UseFormRegisterReturn
	options: Record<string, number> // key-value形式で表示するオプションけど順番的にvalue-keyになってるね
	label?: string // ラベルをオプションで追加
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
 * @param setValue react-hook-formのsetValue
 * @param watchValue 現在の選択値をwatchする
 * @param name フォームフィールドの名前
 * @param props その他のprops
 */
const SelectFieldNumber = ({
	register,
	options,
	label,
	setValue,
	watchValue = [],
	name,
	infoDropdown,
	errorMessage,
	...props
}: SelectFieldProps) => {
	return (
		<div className="form-control w-full max-w-xs">
			{label && <LabelInputField label={label} infoDropdown={infoDropdown} />}
			<select
				className="select select-bordered w-full max-w-xs bg-bg-white"
				{...register}
				{...props}
				{...(props.value ? {} : { defaultValue: '' })}
			>
				<option value="" disabled hidden>
					選択してください
				</option>
				{Object.entries(options).map(([key, value]) => (
					<option key={key} value={value}>
						{key}
					</option>
				))}
			</select>
			{errorMessage && (
				<div className="label">
					<span className="label-text-alt text-error">{errorMessage}</span>
				</div>
			)}
		</div>
	)
}

export default SelectFieldNumber
