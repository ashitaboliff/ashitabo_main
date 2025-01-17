'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'
import { Booking } from '@/types/BookingTypes'
import { authBookingAction } from './actions'
import InfoMessage from '@/components/atoms/InfoMessage'
import BookingDetailBox from '@/components/molecules/BookingDetailBox'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import PasswordInputField from '@/components/molecules/PasswordInputField'
import BookingDetailNotFound from '@/components/booking/BookingDetailNotFound'

const passschema = yup.object({
	password: yup.string().required('パスワードを入力してください'),
})

const BookingEditAuth = ({
	handleSetAuth,
	calendarTime,
	bookingDetail,
	session,
}: {
	handleSetAuth: (isAuth: boolean) => void
	calendarTime: string[]
	bookingDetail: Booking
	session: Session
}) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [showPassword, setShowPassword] = useState<boolean>(false)
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

	const onSubmit = async (data: { password: string }) => {
		setIsLoading(true)
		setIsErrorMessages(undefined)
		setErrorPopupOpen(false)
		try {
			const response = await authBookingAction({
				bookingId: bookingDetail.id,
				password: data.password,
			})
			if (response.status === 200) {
				handleSetAuth(true)
				router.push(`/booking/${bookingDetail.id}/edit`)
			} else if (response.status === 400) {
				setErrorPopupOpen(true)
				setIsErrorMessages('パスワードが間違っています')
			} else if (response.status === 404) {
				setErrorPopupOpen(true)
				setIsErrorMessages('予約が見つかりません')
			} else if (response.status === 403) {
				setErrorPopupOpen(true)
				setIsErrorMessages('パスワードを5回以上間違えたためロックされました')
			} else {
				setErrorPopupOpen(true)
				setIsErrorMessages('想定外のエラーが発生しました')
			}
		} catch (error) {
			setErrorPopupOpen(true)
			setIsErrorMessages('エラーが発生しました')
		}
	}

	useEffect(() => {
		setIsLoading(false)
		handleSetAuth(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (!bookingDetail) {
		return <BookingDetailNotFound />
	}

	return (
		<>
			<p className="text-lg text-center">
				予約編集用のパスワードを入力してください。
			</p>
			<div className="flex justify-center flex-col">
				<div className="flex justify-center">
					<BookingDetailBox
						props={{
							bookingDate: bookingDetail.bookingDate,
							bookingTime: bookingDetail.bookingTime,
							registName: bookingDetail.registName,
							name: bookingDetail.name,
						}}
						calendarTime={calendarTime}
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
							errorMessage={errors.password?.message}
						/>
					</div>
					<div className="flex justify-center mt-4 space-x-4">
						<button type="submit" className="btn btn-success">
							ログイン
						</button>
						<button
							type="button"
							className="btn btn-outline"
							onClick={() => router.push(`/booking/${bookingDetail.id}`)}
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
