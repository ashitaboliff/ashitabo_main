'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Loading from '@/components/atoms/Loading'
import { padLockAction } from './actions'
import { ErrorType } from '@/types/ResponseTypes'

const PasswordSchema = yup.object().shape({
	digit1: yup
		.string()
		.matches(/^\d$/, '0から9の数字を入力してください')
		.required(),
	digit2: yup
		.string()
		.matches(/^\d$/, '0から9の数字を入力してください')
		.required(),
	digit3: yup
		.string()
		.matches(/^\d$/, '0から9の数字を入力してください')
		.required(),
	digit4: yup
		.string()
		.matches(/^\d$/, '0から9の数字を入力してください')
		.required(),
})

type digit = 'digit1' | 'digit2' | 'digit3' | 'digit4'

const AuthPadLock = ({ setAuth }: { setAuth: (isAuth: boolean) => void }) => {
	const router = useRouter()
	const [error, setError] = useState<ErrorType>()
	const [loading, setLoading] = useState<boolean>(false)

	const {
		register,
		handleSubmit,
		setFocus,
		reset,
		formState: { errors },
	} = useForm({
		mode: 'onBlur',
		resolver: yupResolver(PasswordSchema),
	})

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		next: digit | null,
	) => {
		if (e.target.value.length === 1 && next) {
			setFocus(next)
		}
	}

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		prev: digit | null,
	) => {
		if (e.key === 'Backspace' && !e.currentTarget.value && prev) {
			setFocus(prev)
		}
	}

	const onSubmit = async (data: {
		digit1: string
		digit2: string
		digit3: string
		digit4: string
	}) => {
		setLoading(true)
		const password = `${data.digit1}${data.digit2}${data.digit3}${data.digit4}`
		try {
			const res = await padLockAction(password)
			if (res.status !== 204) {
				setError(res)
			} else {
				setAuth(true)
				router.push('')
			}
		} catch (error) {
			setError({
				status: 500,
				response: String(error),
			})
		}
		setLoading(false)
	}

	return (
		<div className="flex flex-col items-center justify-center space-y-2">
			<div className="text-base font-bold mx-2 text-center">
				部室のパスワードを入力してください
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col items-center gap-y-2"
			>
				<div className="flex flex-row justify-center">
					<input
						type="tel"
						{...register('digit1')}
						className="input input-bordered w-16 h-16 text-center text-2xl"
						maxLength={1}
						onChange={(e) => handleChange(e, 'digit2')}
					/>
					<input
						type="tel"
						{...register('digit2')}
						className="input input-bordered w-16 h-16 text-center text-2xl"
						maxLength={1}
						onChange={(e) => handleChange(e, 'digit3')}
						onKeyDown={(e) => handleKeyDown(e, 'digit1')}
					/>
					<input
						type="tel"
						{...register('digit3')}
						className="input input-bordered w-16 h-16 text-center text-2xl"
						maxLength={1}
						onChange={(e) => handleChange(e, 'digit4')}
						onKeyDown={(e) => handleKeyDown(e, 'digit2')}
					/>
					<input
						type="tel"
						{...register('digit4')}
						className="input input-bordered w-16 h-16 text-center text-2xl"
						maxLength={1}
						onKeyDown={(e) => handleKeyDown(e, 'digit3')}
					/>
				</div>
				<div className="flex flex-row justify-center space-x-2">
					<button
						type="submit"
						className="btn btn-primary"
						disabled={error?.status === (403 || 401)}
					>
						送信
					</button>
					<button
						type="button"
						className="btn btn-outline"
						onClick={() => reset()}
					>
						入力をクリア
					</button>
				</div>
				{loading && <Loading />}
				{error && (
					<p className="text-seconday">
						エラーコード{error.status}:{error.response}
					</p>
				)}
			</form>
		</div>
	)
}

export default AuthPadLock
