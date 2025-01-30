import { ReactNode } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import { UseFormRegisterReturn } from 'react-hook-form'
import TextInputField from '@/components/atoms/TextInputField'
import LabelInputField from '@/components/atoms/LabelInputField'

/**
 * テキスト検索フィールド
 * @param register react-hook-formのregister
 */
const TextSearchField = ({
	name,
	register,
	placeholder,
	label,
	infoDropdown,
	disabled,
	className,
	defaultValue,
}: {
	name?: string
	register?: UseFormRegisterReturn
	placeholder?: string
	label?: string
	infoDropdown?: ReactNode
	disabled?: boolean
	className?: string
	defaultValue?: string
}) => {
	const defaultPlaceholder = placeholder || '検索'
	return (
		<div>
			{label && <LabelInputField label={label} infoDropdown={infoDropdown} />}
			<div className={`relative ${className}`}>
				<TextInputField
					name={name}
					register={register}
					placeholder={defaultPlaceholder}
					type="text"
					disabled={disabled}
					defaultValue={defaultValue}
				/>
				<div className="absolute inset-y-0 right-0 flex items-center px-2">
					<HiOutlineSearch className="text-xl" />
				</div>
			</div>
		</div>
	)
}

export default TextSearchField
