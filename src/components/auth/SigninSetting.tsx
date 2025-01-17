'use client'

import { useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
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
import { createProfileAction } from './actions'
import { sessionCheck } from '@/app/actions'

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
	const router = useRouter()
	const session = useSession()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setIsError] = useState<string>('')
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
		defaultValues: {
			role: 'STUDENT',
		},
	})

	const watchPart = watch('part', [])
	const watchRole = watch('role')

	const onSubmit = async (data: any) => {
		setIsLoading(true)
		const isSession = await sessionCheck(session.data)
		if (isSession === 'no-session') {
			setIsError('ログイン情報がありません')
		} else if (isSession === 'profile') {
			setIsError('プロフィールが既に設定されています')
		} else {
			const userId = session.data?.user.id || ''
			try {
				const res = await createProfileAction(userId, data)
				if (res.status === 201) {
					setPopupOpen(true)
				} else {
					console.error(res)
					setIsError(`${res.response}`)
				}
			} catch (error) {
				console.error(error)
				setIsError(
					'エラーが発生しました、このエラーが何度も発生する場合はわたべにお問い合わせください',
				)
			}
		}
		setIsLoading(false)
	}

	if (isLoading) {
		return <Loading />
	}

	return (
		<div className="flex flex-col items-center justify-center p-4">
			<h1 className="text-2xl font-bold">ユーザ設定</h1>
			<form
				className="flex flex-col space-y-4 w-full max-w-xs"
				onSubmit={handleSubmit(onSubmit)}
			>
				<TextInputField
					type="text"
					register={register('name')}
					label="本名"
					infoDropdown="アカウント管理のために本名を入力してください。"
					errorMessage={errors.name?.message}
				/>

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
					{errors.role && (
						<span className="label-text-alt text-error">
							{errors.role.message}
						</span>
					)}
				</div>

				<SelectField
					name="part"
					register={register('part')}
					options={PartMap}
					label="使用楽器(複数選択可)"
					isMultiple={true}
					setValue={setValue}
					watchValue={watchPart}
					infoDropdown={
						<>
							使用楽器を選択してください、複数選択可能です。
							<br />
							また、他の楽器経験があればその他を選択してください。
						</>
					}
					errorMessage={errors.part?.message}
				/>

				{watchRole === 'STUDENT' && (
					<>
						<TextInputField
							type="text"
							register={register('student_id')}
							label="学籍番号"
							infoDropdown={
								<>
									信州大学および長野県立大学の学籍番号のフォーマットに対応しています。
								</>
							}
							errorMessage={errors.student_id?.message}
						/>

						<SelectField
							name="expected"
							register={register('expected')}
							options={expectedYear}
							label="卒業予定年度"
							infoDropdown={
								<>この値はいつでも変更できます。留年しても大丈夫！（笑）</>
							}
							errorMessage={errors.expected?.message}
						/>
					</>
				)}

				<button type="submit" className="btn btn-primary">
					保存
				</button>
			</form>
			{error !== '' && (
				<InfoMessage
					message={`${error}`}
					messageType="error"
					IconColor="bg-white"
				/>
			)}
			<Popup
				ref={popupRef}
				open={popupOpen}
				title="保存完了"
				children={
					<>
						<p>プロフィールを保存しました</p>
						<button
							className="btn btn-primary"
							onClick={() => router.push('/user')}
						>
							ユーザーページに移動
						</button>
					</>
				}
				onClose={() => setPopupOpen(false)}
			/>
		</div>
	)
}

export default SigninSetting
