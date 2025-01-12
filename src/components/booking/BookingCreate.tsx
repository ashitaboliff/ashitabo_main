'use client'

import React, { useEffect, useState, useRef, ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSearchParams, useRouter } from 'next/navigation'
import { format, addDays, set, sub, subDays } from 'date-fns'
import { da, is, ja } from 'date-fns/locale'
import { DateToDayISOstring } from '@/lib/CommonFunction'
import { createBookingAction } from './actions'
import Loading from '@/components/atoms/Loading'
import TextInputField from '@/components/atoms/TextInputField'
import InfoMessage from '@/components/atoms/InfoMessage'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import { Session } from 'next-auth'
import PasswordInputField from '../molecules/PasswordInputField'

type PopupChildren = {
	title: string
	children: ReactNode
}

const today = new Date(
	new Date().getFullYear(),
	new Date().getMonth(),
	new Date().getDate(),
	0,
	0,
	0,
)
const isAbleBookingDateMax = addDays(today, 28)
const isPaidBookingDateMin = addDays(today, 14)

const schema = yup.object().shape({
	bookingDate: yup.string().required('日付を入力してください'),
	bookingTime: yup.string().required('時間を入力してください'),
	registName: yup.string().required('バンド名を入力してください'),
	name: yup.string().required('責任者名を入力してください'),
	password: yup.string().required('パスワードを入力してください'),
})

const NewBooking = ({
	calendarTime,
	session,
}: {
	calendarTime: string[]
	session: Session
}) => {
	const router = useRouter()
	const [isState, setIsState] = useState<'loading' | 'input' | 'submit'>(
		'loading',
	)
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [PopupChildren, setPopupChildren] = useState<PopupChildren | null>(null)
	const [noticePopupOpen, setNoticePopupOpen] = useState(false)
	const noticePopupRef = useRef<PopupRef>(undefined)

	const regexDate = /^\d{4}-\d{2}-\d{2}$/
	const regexTime = /^\d{1}$/

	const queryParams = useSearchParams()
	const bookingDate = queryParams.get('date')
		? regexDate.test(queryParams.get('date') as string)
			? new Date(queryParams.get('date') as string)
			: new Date()
		: new Date()
	const bookingTime = queryParams.get('time')
		? regexTime.test(queryParams.get('time') as string)
			? (queryParams.get('time') as string)
			: '0'
		: '0'

	const isPaid =
		new Date(
			bookingDate.getFullYear(),
			bookingDate.getMonth(),
			bookingDate.getDate(),
			0,
			0,
			0,
		) > isPaidBookingDateMin

	const handleClickShowPassword = () => setShowPassword((show) => !show)
	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		event.preventDefault()
	}

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		mode: 'onBlur',
		resolver: yupResolver(schema),
		defaultValues: {
			bookingDate: bookingDate.toISOString().split('T')[0],
			bookingTime: calendarTime[Number(bookingTime)],
		},
	})

	useEffect(() => {
		setIsState('input')
		setNoticePopupOpen(false)
	}, [])

	useEffect(() => {
		if (isState === 'submit') {
			setNoticePopupOpen(true)
		} else {
			setNoticePopupOpen(false)
		}
	}, [isState])

	const onSubmit = async (data: any) => {
		const reservationData = {
			bookingDate: DateToDayISOstring(bookingDate),
			bookingTime: Number(bookingTime),
			registName: data.registName,
			name: data.name,
			isDeleted: false,
		}

		let isPaidExpired = undefined
		if (isPaid) {
			const isPaidExpiredDate = subDays(bookingDate, 7)
			isPaidExpired = DateToDayISOstring(isPaidExpiredDate)
		}

		try {
			const response = await createBookingAction({
				userId: session.user.id,
				booking: reservationData,
				isPaid: isPaid,
				isPaidExpired: isPaidExpired,
				password: data.password,
				toDay: today.toISOString(),
				isPaidBookingDateMin: isPaidBookingDateMin.toISOString(),
			})

			if (response.status === 201) {
				setPopupChildren({
					title: '予約完了',
					children: (
						<div className="text-center">
							<p>以下の内容で予約が完了しました。</p>
							<p>
								日付:{' '}
								{format(bookingDate, 'yyyy/MM/dd(E)', {
									locale: ja,
								})}
							</p>
							<p>時間: {calendarTime[Number(bookingTime)]}</p>
							<p>バンド名: {watch('registName')}</p>
							<p>責任者: {watch('name')}</p>
							{isPaid && isPaidExpired && (
								<>
									<p>支払い: 600円</p>
									<p>
										支払い期限:{' '}
										{format(isPaidExpired, 'yyyy/MM/dd(E)', { locale: ja })}
									</p>
								</>
							)}
							<button
								type="button"
								className="btn btn-outline mt-4"
								onClick={() => {
									router.push('/booking')
									setNoticePopupOpen(false)
								}}
							>
								カレンダーに戻る
							</button>
						</div>
					),
				})
				setIsState('submit')
			} else {
				let errorMsg: string
				switch (response.status) {
					case 400:
						errorMsg = '予約に失敗しました。予約時間の範囲外です。'
						break
					case 409:
						errorMsg = '予約に失敗しました。予約が重複しています。'
						break
					case 403:
						errorMsg =
							'予約に失敗しました。同一ユーザの無料予約は2週間で4件までです。'
						break
					case 404:
						errorMsg =
							'予約に失敗しました。ログインしなおしてから予約を行ってください。'
						break
					case 500:
						errorMsg = `${response.response}`
						break
					default:
						errorMsg =
							'予約に失敗しました。何度もこのエラーが出る場合、管理者に連絡してください。'
						break
				}
				setPopupChildren({
					title: 'エラー',
					children: (
						<div className="text-center">
							<InfoMessage
								messageType="error"
								IconColor="bg-white"
								message={errorMsg}
							/>
							<button
								type="button"
								className="btn btn-outline mt-4"
								onClick={() => {
									setNoticePopupOpen(false)
									setIsState('input')
								}}
							>
								閉じる
							</button>
						</div>
					),
				})
				setIsState('submit')
			}
		} catch (error) {
			setPopupChildren({
				title: 'エラー',
				children: (
					<div className="text-center">
						<InfoMessage
							messageType="error"
							IconColor="bg-white"
							message={
								'予約に失敗しました。何度もこのエラーが出る場合、管理者に連絡してください。'
							}
						/>
						<button
							type="button"
							className="btn btn-outline mt-4"
							onClick={() => {
								setNoticePopupOpen(false)
								setIsState('input')
							}}
						>
							閉じる
						</button>
					</div>
				),
			})
		}
	}

	if (isState === 'loading') {
		return <Loading />
	}

	return (
		<div className="p-8">
			<div className="text-center mb-8">
				<h2 className="text-2xl font-bold">新規予約</h2>
			</div>

			<div className="max-w-md mx-auto">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
					<TextInputField
						register={register('bookingDate')}
						placeholder="日付"
						type="date"
						disabled={true}
					/>
					<TextInputField
						register={register('bookingTime')}
						placeholder="時間"
						type="text"
						disabled={true}
					/>
					<TextInputField
						register={register('registName')}
						placeholder="バンド名"
						type="text"
					/>
					{errors.registName && (
						<div className="flex justify-center">
							<InfoMessage
								messageType="error"
								IconColor="bg-white"
								message={errors.registName.message}
							/>
						</div>
					)}
					<TextInputField
						register={register('name')}
						placeholder="責任者名"
						type="text"
					/>
					{errors.name && (
						<div className="flex justify-center">
							<InfoMessage
								messageType="error"
								IconColor="bg-white"
								message={errors.name.message}
							/>
						</div>
					)}
					<PasswordInputField
						register={register('password')}
						showPassword={showPassword}
						handleClickShowPassword={handleClickShowPassword}
						handleMouseDownPassword={handleMouseDownPassword}
					/>
					{isPaid && (
						<div className="flex justify-center">
							<InfoMessage
								messageType="warning"
								IconColor="bg-white"
								message="このコマを予約するには600円の支払いが必要です。"
							/>
						</div>
					)}

					<div className="flex justify-center space-x-4">
						<button type="submit" className="btn btn-primary">
							予約する
						</button>
						<button
							type="button"
							className="btn btn-outline"
							onClick={() => router.push('/booking')}
						>
							カレンダーに戻る
						</button>
					</div>
				</form>
			</div>

			{/* Completion Popup */}
			<Popup
				ref={noticePopupRef}
				title={PopupChildren?.title as string}
				maxWidth="md"
				open={noticePopupOpen}
				onClose={() => setNoticePopupOpen(false)}
			>
				{PopupChildren?.children}
			</Popup>
		</div>
	)
}

export default NewBooking
