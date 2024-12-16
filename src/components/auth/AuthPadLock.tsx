'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Loading from '@/components/atoms/Loading'
import { padLockAction } from './actions'

const PasswordSchema = yup.object().shape({
	digit1: yup
		.number()
		.required('数字を入力してください')
		.min(0, '入力は0から9までです')
		.max(9, '入力は0から9までです'),
	digit2: yup
		.number()
		.required('数字を入力してください')
		.min(0, '入力は0から9までです')
		.max(9, '入力は0から9までです'),
	digit3: yup
		.number()
		.required('数字を入力してください')
		.min(0, '入力は0から9までです')
		.max(9, '入力は0から9までです'),
	digit4: yup
		.number()
		.required('数字を入力してください')
		.min(0, '入力は0から9までです')
		.max(9, '入力は0から9までです'),
})

const AuthPadLock = () => {
	const router = useRouter()
	const [error, setError] = useState<string | undefined>()
	const [loading, setLoading] = useState<boolean>(false)

	const {
		register,
		handleSubmit,
		watch,
		setFocus,
		formState: { errors },
	} = useForm({
		mode: 'onBlur',
		resolver: yupResolver(PasswordSchema),
	})

	useEffect(() => {
		if (errors) {
			setError(
				Object.values(errors)
					.map((error) => error.message)
					.join(', '),
			)
		}
	}, [errors])

	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name && String(value[name])?.length === 1) {
				if (name === 'digit1') setFocus('digit2')
				if (name === 'digit2') setFocus('digit3')
				if (name === 'digit3') setFocus('digit4')
			}
		})
		return () => subscription.unsubscribe()
	}, [watch, setFocus])

	const onSubmit = async (data: {
		digit1: number
		digit2: number
		digit3: number
		digit4: number
	}) => {
		setLoading(true)
		const password = `${data.digit1}${data.digit2}${data.digit3}${data.digit4}`
		try {
			const res = await padLockAction(password)
			if (res.status === 200) {
				router.push('/auth/signin')
			} else {
				setError(res.response as string)
			}
		} catch (error) {
			setError('エラーが発生しました')
		}
		setLoading(false)
	}

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="text-lg font-bold mx-2 text-center">
				部室のパスワードを入力してください
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col items-center justify-center"
			>
				<div>
					<input
						type="number"
						{...register('digit1')}
						className="input input-bordered w-16 h-16 text-center text-2xl"
					/>
					<input
						type="number"
						{...register('digit2')}
						className="input input-bordered w-16 h-16 text-center text-2xl"
					/>
					<input
						type="number"
						{...register('digit3')}
						className="input input-bordered w-16 h-16 text-center text-2xl"
					/>
					<input
						type="number"
						{...register('digit4')}
						className="input input-bordered w-16 h-16 text-center text-2xl"
					/>
				</div>
				<button type="submit" className="btn btn-primary">
					送信
				</button>
				{loading && <Loading />}
				{error && <p>{error}</p>}
			</form>
		</div>
	)
}

export default AuthPadLock
