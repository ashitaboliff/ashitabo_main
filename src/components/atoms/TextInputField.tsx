import { ReactNode } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import LabelInputField from '@/components/atoms/LabelInputField'

/**
 * テキスト入力フィールド
 * @param register react-hook-formのregister
 * @param placeholder 後ろに薄く見えるテキスト
 * @param type inputのtype
 * @param label ラベル
 */
const TextInputField = ({
	register,
	placeholder,
	type,
	label,
	infoDropdown,
	disabled,
	errorMessage,
	...props
}: {
	register: UseFormRegisterReturn
	placeholder?: string
	type: string
	label?: string
	infoDropdown?: ReactNode
	disabled?: boolean
	errorMessage?: string
}) => {
	return (
		<div>
			{label && <LabelInputField label={label} infoDropdown={infoDropdown} />}
			<input
				type={type}
				placeholder={placeholder}
				className="input input-bordered w-full pr-10"
				disabled={disabled}
				{...register}
				{...props}
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
