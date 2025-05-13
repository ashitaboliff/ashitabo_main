import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { UseFormRegisterReturn } from 'react-hook-form'
import TextInputField from '@/components/ui/atoms/TextInputField'
import LabelInputField from '@/components/ui/atoms/LabelInputField'

/**
 * パスワード入力フィールド
 * @param register react-hook-formのregister
 * @param showPassword パスワード表示の有無
 * @param handleClickShowPassword パスワード表示の切り替え関数、見えるほう
 * @param handleMouseDownPassword パスワード表示の切り替え関数、見えなくするほう
 */
const PasswordInputField = ({
	label,
	register,
	showPassword,
	handleClickShowPassword,
	handleMouseDownPassword,
	errorMessage,
}: {
	label?: string
	register: UseFormRegisterReturn
	showPassword: boolean
	handleClickShowPassword: () => void
	handleMouseDownPassword: (event: React.MouseEvent<HTMLButtonElement>) => void
	errorMessage?: string
}) => {
	return (
		<div>
			{label && <LabelInputField label={label} />}
			<div className="relative">
				<TextInputField
					register={register}
					type={showPassword ? 'text' : 'password'}
					placeholder="パスワード"
					errorMessage={errorMessage}
				/>
				<button
					type="button"
					className="absolute inset-y-0 right-0 flex items-center px-2"
					onClick={handleClickShowPassword}
					onMouseDown={handleMouseDownPassword}
				>
					{showPassword ? (
						<MdVisibilityOff className="text-xl" />
					) : (
						<MdVisibility className="text-xl" />
					)}
				</button>
			</div>
		</div>
	)
}

export default PasswordInputField
