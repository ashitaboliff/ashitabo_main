import { ReactNode } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import LabelInputField from '@/components/ui/atoms/LabelInputField'

/**
 * テキスト入力フィールド
 * @param register react-hook-formのregister
 * @param placeholder プレースホルダー
 * @param type 入力タイプ
 * @param label ラベル
 * @param infoDropdown ドロップダウンの情報
 * @param disabled フィールドの無効化
 * @param errorMessage エラーメッセージ
 * @param className クラス名
 * @param value 値
 * @param onChange 値の変更時の関数
 * @param defaultValue デフォルト値
 */

type TextInputFieldProps = {
	name?: string
	register?: UseFormRegisterReturn
	placeholder?: string
	type: string
	label?: string
	infoDropdown?: ReactNode
	disabled?: boolean
	errorMessage?: string
	className?: string
	value?: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	defaultValue?: string
	autocomplete?: string
}

const TextInputField = ({
	name,
	register,
	placeholder,
	type,
	label,
	infoDropdown,
	disabled,
	errorMessage,
	className,
	value,
	onChange,
	defaultValue,
	autocomplete,
	...props
}: TextInputFieldProps) => {
	return (
		<div className="flex flex-col w-full">
			{label && <LabelInputField label={label} infoDropdown={infoDropdown} />}
			<input
				name={name}
				type={type}
				placeholder={placeholder}
				className={`input input-bordered w-full pr-10 bg-white ${className}`}
				disabled={disabled}
				value={value}
				onChange={onChange}
				defaultValue={defaultValue}
				{...register}
				{...props}
				autoComplete={autocomplete}
			/>

			{errorMessage && (
				<div className="label">
					<span className="text-error label-text-alt">{errorMessage}</span>
				</div>
			)}
		</div>
	)
}

export default TextInputField
