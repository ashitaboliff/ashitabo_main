'use client'

import { useRef, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next-nprogress-bar'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { RoleMap, Role, PartMap, Profile, Part } from '@/features/user/types'
import { ErrorType } from '@/utils/types/responseTypes'
import { generateFiscalYearObject, generateAcademicYear } from '@/utils'
import Loading from '@/components/ui/atoms/Loading'
import InfoMessage from '@/components/ui/atoms/InfoMessage'
import TextInputField from '@/components/ui/atoms/TextInputField'
import SelectField from '@/components/ui/atoms/SelectField'
import Popup, { PopupRef } from '@/components/ui/molecules/Popup'
import { putProfileAction } from '@/features/auth/components/actions'
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

const ProfileEdit = ({ profile }: { profile: Profile }) => {
	const session = useSession()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setIsError] = useState<ErrorType>()
	const [popupOpen, setPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)

	// なんかPartだけ読み込まれないのでここでrefresh
	useEffect(() => {
		router.refresh()
		// eslint-disable-next-line react-hooks/rules-of-hooks
	}, [router])

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
			student_id: profile.student_id as string,
			expected: profile.expected as string,
			role: profile.role as Role,
			part: profile.part as Part[],
			name: profile.name as string,
		},
	})

	const watchPart = watch('part', [])
	const watchRole = watch('role')
	const watchStudentId = watch('student_id')

	// student_idが変更されたときにexpectedのdefaultValueを設定
	useEffect(() => {
		if (watchStudentId && watchRole === 'STUDENT') {
			const yearPrefix = watchStudentId.substring(0, 2) // 最初の2桁を取得
			const alphabet = watchStudentId.charAt(2).toUpperCase() // 3文字目のアルファベットを取得

			let yearOffset = 4 // デフォルトのオフセット
			switch (alphabet) {
				case 'T':
				case 't':
					yearOffset = 6
					break
				case 'E':
				case 'e':
				case 'G':
				case 'g':
				case 'F':
				case 'f':
				case 'C':
				case 'c':
					yearOffset = 4
					break
				case 'W':
				case 'w':
					yearOffset = 2
					break
				default:
					yearOffset = 4
			}

			const expectedYearKey = `${(parseInt(yearPrefix) + yearOffset) % 100}` // 年度を計算

			// expectedYearオブジェクトに存在するか確認
			if (expectedYear[expectedYearKey]) {
				setValue('expected', expectedYearKey) // expectedフィールドに値を設定
			}
		}
	}, [watchStudentId, watchRole, setValue])

	const onSubmit = async (data: any) => {
		setIsLoading(true)
		// クライアントサイドのセッション情報を sessionCheck に渡す
		// session.data が null の可能性も考慮
		const sessionStatus = session.data
			? await sessionCheck(session.data)
			: 'no-session'

		if (sessionStatus === 'no-session') {
			setIsError({
				status: 401,
				response: 'ログイン情報がありません。再度ログインしてください。',
			})
			// router.push('/auth/signin'); // 必要に応じてサインインページへリダイレクト
		} else {
			// 'session' または 'profile' の場合、プロファイル更新処理を実行
			const userId = session.data?.user.id || ''
			if (!userId) {
				setIsError({
					status: 401,
					response: 'ユーザーIDが取得できませんでした。',
				})
				setIsLoading(false)
				return
			}
			try {
				const res = await putProfileAction(userId, data)
				if (res.status === 200) {
					setPopupOpen(true)
					// セッションを更新してProfileの変更を反映
					// ダミーデータを渡して update トリガーを確実に発火させる
					await session.update({ triggerUpdate: Date.now() }) 
					router.refresh(); // セッション更新後にページをリフレッシュ
				} else {
					setIsError(res)
				}
			} catch (error) {
				setIsError({
					status: 500,
					response:
						'このエラーが出た際はわたべに問い合わせてください。' +
						String(error),
				})
			}
		}
		setIsLoading(false)
	}

	if (isLoading) {
		return <Loading />
	}

	return (
		<div className="flex flex-col items-center justify-center p-4 bg-white shadow-lg rounded-lg">
			<h1 className="text-2xl font-bold">プロフィール編集</h1>
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
							使用楽器を選択してください、複数選択可能です
							<br />
							また、他の楽器経験があればその他を選択してください
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
						<p className="text-sm">
							※学籍番号から工学部生は院進を想定し、留年を想定していない値が自動計算されます。変更したい場合は編集を行ってください
						</p>
					</>
				)}

				<div className="flex flex-row items-center space-x-2 justify-center">
					<button type="submit" className="btn btn-primary">
						更新
					</button>
					<button
						type="button"
						className="btn btn-outline"
						onClick={() => router.back()}
					>
						戻る
					</button>
				</div>
			</form>
			{error && (
				<p className="text-sm text-error text-center">
					エラーコード{error.status}:{error.response}
				</p>
			)}
			<Popup
				id={`profile-edit-popup-${profile.id}`}
				ref={popupRef}
				open={popupOpen}
				title="保存完了"
				onClose={() => setPopupOpen(false)}
			>
				<div className="p-4 flex flex-col justify-center gap-2">
					<p>プロフィールを保存しました</p>
					<button
						className="btn btn-primary"
						onClick={() => router.push('/user')}
					>
						ユーザーページへ移動
					</button>
				</div>
			</Popup>
		</div>
	)
}

export default ProfileEdit
