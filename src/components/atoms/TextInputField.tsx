import { UseFormRegisterReturn } from 'react-hook-form'

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
	...props
}: {
	register: UseFormRegisterReturn
	placeholder?: string
	type: string
	label?: string
}) => {
	return (
		<div>
			<label className="label">{label}</label>
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
