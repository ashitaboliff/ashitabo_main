import { ReactNode } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import IconFactory from '@/svg/IconFactory'

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
			<label className="label flex flex-row justify-start gap-2">
				{label}
				{infoDropdown && (
					<div className="dropdown dropdown-right">
						<div tabIndex={0} role="button">
							{IconFactory.getIcon({ color: 'info', type: 'info', size: 4 })}
						</div>
						<div className="card dropdown-content compact w-48 bg-bg-white shadow rounded-box p-2 ">
							<p className="text-sm">{infoDropdown}</p>
						</div>
					</div>
				)}
			</label>
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
