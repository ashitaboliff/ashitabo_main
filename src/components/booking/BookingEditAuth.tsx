'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { Booking } from '@/types/BookingTypes'
import Loading from '@/components/atoms/Loading'
import InfoMessage from '@/components/atoms/InfoMessage'
import BookingDetailBox from '@/components/molecules/BookingDetailBox'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import PasswordInputField from '@/components/molecules/PasswordInputField'
import BookingDetailNotFound from '@/components/booking/BookingDetailNotFound'

const passschema = yup.object({
	password: yup.string().required('パスワードを入力してください'),
})

interface Props {
	id: string
	isAuth: boolean
	handleSetAuth: (isAuth: boolean) => void
}

const BookingEditAuth = (props: Props) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [bookingDetail, setBookingDetail] = useState<Booking>()
	const [isErrorMessages, setIsErrorMessages] = useState<string | undefined>(
		undefined,
	)
	const [errorPopupOpen, setErrorPopupOpen] = useState<boolean>(false)
	const errorPopupRef = useRef<PopupRef>(undefined)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'onBlur',
		resolver: yupResolver(passschema),
	})
	const handleClickShowPassword = () => setShowPassword((show) => !show)
	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		event.preventDefault()
	}

	const fetchBookingDetail = async () => {
		setIsLoading(true)
		setIsErrorMessages(undefined)
		setErrorPopupOpen(false)
		try {
			const response = await fetch(`/api/booking/detail?id=${props.id}`)
			if (response.ok) {
				const data = await response.json()
				setBookingDetail(data.response)
			} else {
				setErrorPopupOpen(true)
				setIsErrorMessages('予約情報が見つかりませんでした')
			}
		} catch (error) {
			setErrorPopupOpen(true)
			setIsErrorMessages('エラーが発生しました')
		}
		setIsLoading(false)
	}

	const onSubmit = async (data: { password: string }) => {
		setIsLoading(true)
		setIsErrorMessages(undefined)
		setErrorPopupOpen(false)
		try {
			const response = await fetch('/api/booking/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					booking_id: props.id,
					password: data.password,
				}),
			})
			if (response.ok) {
				props.handleSetAuth(true)
				router.push(`/booking/edit?id=${props.id}`)
			} else {
				setErrorPopupOpen(true)
				setIsErrorMessages('パスワードが違います')
			}
		} catch (error) {
			setErrorPopupOpen(true)
			setIsErrorMessages('エラーが発生しました')
		}
		setIsLoading(false)
	}

	useEffect(() => {
		setIsLoading(false)
		props.handleSetAuth(false)
		fetchBookingDetail()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		props.handleSetAuth(false)
		fetchBookingDetail()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props])

	if (isLoading) {
		return <Loading />
	}

	if (!bookingDetail) {
		return <BookingDetailNotFound />
	}

	return (
		<>
			<p className="text-lg text-center">
				予約を編集するためにパスワードを入力してください。
			</p>
			<div className="flex justify-center flex-col">
				<div className="flex justify-center">
					<BookingDetailBox
						props={{
							booking_date: bookingDetail.booking_date,
							booking_time: bookingDetail.booking_time,
							regist_name: bookingDetail.regist_name,
							name: bookingDetail.name,
						}}
					/>
				</div>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col items-center mt-4"
				>
					<div className="form-control w-full max-w-xs my-2">
						<label className="label" htmlFor="password">
							<span className="label-text">パスワード</span>
						</label>
						<PasswordInputField
							register={register('password')}
							showPassword={showPassword}
							handleClickShowPassword={handleClickShowPassword}
							handleMouseDownPassword={handleMouseDownPassword}
						/>
					</div>
					{errors.password && (
						<InfoMessage
							message={errors.password.message || ''}
							messageType="warning"
							IconColor="bg-white"
						/>
					)}
					<div className="flex justify-center mt-4 space-x-4">
						<button type="submit" className="btn btn-success">
							ログイン
						</button>
						<button
							type="button"
							className="btn btn-outline"
							onClick={() => router.push(`/booking/detail?id=${props.id}`)}
						>
							予約詳細に戻る
						</button>
					</div>
				</form>
			</div>
			<Popup
				ref={errorPopupRef}
				title="エラー"
				maxWidth="sm"
				open={errorPopupOpen}
				onClose={() => setErrorPopupOpen(false)}
			>
				<div className="p-4 flex flex-col justify-center gap-2">
					<InfoMessage
						message={isErrorMessages || ''}
						messageType="error"
						IconColor="bg-white"
					/>
					<button
						className="btn btn-outline"
						onClick={() => setErrorPopupOpen(false)}
					>
						閉じる
					</button>
				</div>
			</Popup>
		</>
	)
}

export default BookingEditAuth
