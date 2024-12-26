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
	...props
}: {
	register: UseFormRegisterReturn
	placeholder?: string
	type: string
	label?: string
	infoDropdown?: ReactNode
}) => {
	return (
		<div>
			{label && <LabelInputField label={label} infoDropdown={infoDropdown} />}
			<input
				type={type}
				placeholder={placeholder}
				className="input input-bordered w-full pr-10"
				{...register}
				{...props}
			/>
		</div>
	)
}

export default TextInputField
