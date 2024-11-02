'use client'

import { useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { RoleMap, Role, PartMap } from '@/types/UserTypes'
import {
	generateFiscalYearObject,
	generateAcademicYear,
} from '@/lib/CommonFunction'
import Loading from '@/components/atoms/Loading'
import InfoMessage from '@/components/atoms/InfoMessage'
import TextInputField from '@/components/atoms/TextInputField'
import SelectField from '@/components/atoms/SelectField'
import Popup, { PopupRef } from '@/components/molecules/Popup'

const academicYearLastTwoDigits = generateAcademicYear() % 100

// 過去8年分の年度を生成
const validYears = Array.from(
	{ length: 9 },
	(_, i) => (academicYearLastTwoDigits - i + 100) % 100,
).map((year) => year.toString().padStart(2, '0'))

// 有効な年度を使って正規表現を作成
const yearRegex = `(${validYears.join('|')})`

const expectedYear = generateFiscalYearObject()

const schema = yup.object().shape({
	name: yup.string().required('名前を入力してください'),
	student_id: yup.string().when('role', {
		is: (role: Role) => role === 'STUDENT',
		then: (schema) =>
			schema
				.matches(
					new RegExp(`^${yearRegex}[A-Za-z](\\d{1}\\d{3}[A-Za-z]|\\d{3})$`),
					'学籍番号のフォーマットが正しくありません',
				)
				.required('学籍番号を入力してください'),
		otherwise: (schema) => schema.notRequired(),
	}),
	expected: yup.mixed().when('role', {
		is: (role: Role) => role === 'STUDENT',
		then: (schema) =>
			schema.required('卒業予定年度を選択してください').oneOf(
				Object.keys(expectedYear).map((year) => year),
				'卒業予定年度を選択してください',
			),
		otherwise: (schema) => schema.notRequired(),
	}),
	role: yup
		.mixed()
		.oneOf(Object.keys(RoleMap).map((role) => role))
		.required('どちらかを選択してください'),
	part: yup
		.array()
		.of(yup.string().oneOf(Object.keys(PartMap).map((part) => part)))
		.required('使用楽器を選択してください')
		.min(1, '使用楽器を選択してください'),
})

const SigninSetting = () => {
	const session = useSession()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isError, setIsError] = useState<boolean>(false)
	const [popupOpen, setPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		mode: 'onBlur',
		resolver: yupResolver(schema),
	})

	const watchPart = watch('part', [])
	const watchRole = watch('role')

	const onSubmit = async (data: any) => {
		setIsLoading(true)
		console.log('data:', data)
		try {
			const response = await fetch('/api/profile', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})
			if (response.ok) {
				setPopupOpen(true)
			} else {
				setIsError(true)
			}
		} catch (error) {
			setIsError(true)
		}
		setIsLoading(false)
	}

	if (isLoading) {
		return <Loading />
	}

	if (session) {
		console.log('a:', session)
	}

	return (
		<div className="flex flex-col items-center justify-center p-4">
			<h1 className="text-2xl font-bold">ユーザ設定</h1>
			<form
				className="flex flex-col space-y-4 w-full max-w-xs"
				onSubmit={handleSubmit(onSubmit)}
			>
				<TextInputField type="text" register={register('name')} label="本名" />
				{errors.name && (
					<InfoMessage
						message={errors.name.message}
						messageType="warning"
						IconColor="bg-white"
					/>
				)}

				<div className="flex flex-row items-center space-x-2">
					<label className="label cursor-pointer">
						<input
							type="radio"
							value="STUDENT"
							{...register('role')}
							className="radio radio-primary"
							defaultChecked
						/>
						<span className="label-text">現役生</span>
					</label>

					<label className="label cursor-pointer">
						<input
							type="radio"
							value="GRADUATE"
							{...register('role')}
							className="radio radio-primary"
						/>
						<span className="label-text">卒業生</span>
					</label>
				</div>
				{errors.role && (
					<InfoMessage
						message={errors.role.message}
						messageType="warning"
						IconColor="bg-white"
					/>
				)}

				<SelectField
					name="part"
					register={register('part')}
					options={PartMap}
					label="使用楽器(複数選択可)"
					isMultiple={true}
					setValue={setValue}
					watchValue={watchPart}
				/>
				{errors.part && (
					<InfoMessage
						message={errors.part.message}
						messageType="warning"
						IconColor="bg-white"
					/>
				)}

				{watchRole === 'STUDENT' && (
					<>
						<TextInputField
							type="text"
							register={register('student_id')}
							label="学籍番号"
						/>
						{errors.student_id && (
							<InfoMessage
								message={errors.student_id.message}
								messageType="warning"
								IconColor="bg-white"
							/>
						)}

						<SelectField
							name="expected"
							register={register('expected')}
							options={expectedYear}
							label="卒業予定年度"
						/>
						{errors.expected && (
							<InfoMessage
								message={errors.expected.message}
								messageType="warning"
								IconColor="bg-white"
							/>
						)}
					</>
				)}

				<button type="submit" className="btn btn-primary">
					保存
				</button>
			</form>
			{isError && (
				<InfoMessage
					message="エラーが発生しました"
					messageType="error"
					IconColor="bg-white"
				/>
			)}
			<Popup
				ref={popupRef}
				open={popupOpen}
				title="保存完了"
				children="プロフィールを保存しました"
				onClose={() => setPopupOpen(false)}
			/>
		</div>
	)
}

export default SigninSetting
