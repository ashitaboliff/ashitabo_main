'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { createPadLockAction, deletePadLockAction } from './action'
import { PadLock } from '@/types/AdminTypes'
import TextInputField from '@/components/atoms/TextInputField'
import SelectField from '@/components/atoms/SelectField'
import Popup, { PopupRef } from '@/components/molecules/Popup'

import { TiDeleteOutline } from 'react-icons/ti'

const PadLockSchema = yup.object().shape({
	name: yup.string().required('鍵管理のための名前を入力してください'),
	password: yup.number().required('パスワードを入力してください'),
})

const PadLockEdit = ({ padLocks }: { padLocks: PadLock[] }) => {
	const router = useRouter()
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [padLocksPerPage, setPadLocksPerPage] = useState(10)
	const [popupData, setPopupData] = useState<PadLock | undefined | null>(
		padLocks?.[0] ?? undefined,
	)
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)
	const [isCreatePopupOpen, setIsCreatePopupOpen] = useState<boolean>(false)
	const createPopupRef = useRef<PopupRef>(undefined)
	const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false)
	const deletePopupRef = useRef<PopupRef>(undefined)

	const totalPadLocks = padLocks?.length ?? 0
	const pageMax = Math.ceil(totalPadLocks / padLocksPerPage)

	const indexOfLastPadLock = currentPage * padLocksPerPage
	const indexOfFirstPadLock = indexOfLastPadLock - padLocksPerPage
	const currentPadLocks =
		padLocks?.slice(indexOfFirstPadLock, indexOfLastPadLock) ?? []

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		mode: 'onBlur',
		resolver: yupResolver(PadLockSchema),
	})

	const onSubmit = async (data: any) => {
		const name = data.name
		const password = data.password
		const res = await createPadLockAction({
			name,
			password: password.toString(),
		})
		if (res.status === 201) {
			setIsCreatePopupOpen(false)
			reset()
			console.log('success')
		} else {
			console.log(res)
		}
	}

	const onDelete = async (id: string) => {
		const res = await deletePadLockAction(id)
		if (res.status === 200) {
			setIsDeletePopupOpen(false)
			setIsPopupOpen(false)
			console.log('success')
		} else {
			console.log(res)
		}
	}

	return (
		<div className="flex flex-col items-center justify-center gap-y-2">
			<h1 className="text-2xl font-bold">ログイン用パスワード管理</h1>
			<p className="text-sm text-center">
				このページではアカウント新規作成時のログイン用パスワードを管理することができます。
				<br />
				基本的には部室の4桁のパスワードを年間で管理しますが、OB、OG用のパスワードを発行することも可能です。
			</p>
			<button
				className="btn btn-primary btn-outline btn-md"
				onClick={() => setIsCreatePopupOpen(true)}
			>
				パスワードを新規作成
			</button>
			<div className="overflow-x-auto w-full flex flex-col justify-center gap-y-2">
				<div className="flex flex-row items-center ml-auto space-x-2 w-1/2">
					<p className="text-sm whitespace-nowrap">表示件数:</p>
					<SelectField
						value={padLocksPerPage}
						onChange={(e) => {
							setPadLocksPerPage(Number(e.target.value))
							setCurrentPage(1)
						}}
						options={{ 5: '5件', 10: '10件', 20: '20件' }}
						name="padLocksPerPage"
					/>
				</div>
				<table className="table table-zebra table-sm w-full max-w-36 justify-center">
					<thead>
						<tr>
							<th></th>
							<th>管理名</th>
							<th>作成日</th>
							<th>更新日</th>
						</tr>
					</thead>
					<tbody>
						{currentPadLocks.map((padLock) => (
							<tr
								key={padLock.id}
								onClick={() => {
									setPopupData(padLock)
									setIsPopupOpen(true)
								}}
							>
								<td>
									{padLock.isDeleted && (
										<div className="badge badge-error text-bg-light">
											<TiDeleteOutline className="inline" />
										</div>
									)}
								</td>
								<td>{padLock.name}</td>
								<td>
									{format(padLock.createdAt, 'yyyy年MM月dd日hh時mm分ss秒', {
										locale: ja,
									})}
								</td>
								<td>
									{format(padLock.updatedAt, 'yyyy年MM月dd日hh時mm分ss秒', {
										locale: ja,
									})}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Popup
				ref={popupRef}
				title="パスワード詳細"
				open={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
			>
				<div className="flex flex-col items-center space-y-2 text-sm">
					{popupData?.isDeleted && (
						<div className="text-error font-bold">削除済み</div>
					)}
					<div className="grid grid-cols-2 gap-2">
						<div className="font-bold">管理名:</div>
						<div>{popupData?.name}</div>
						<div className="font-bold">作成日:</div>
						<div>
							{popupData?.createdAt &&
								format(popupData?.createdAt, 'yyyy年MM月dd日hh時mm分ss秒', {
									locale: ja,
								})}
						</div>
						<div className="font-bold">更新日:</div>
						<div>
							{popupData?.updatedAt &&
								format(popupData?.updatedAt, 'yyyy年MM月dd日hh時mm分ss秒', {
									locale: ja,
								})}
						</div>
					</div>
					<div className="flex flex-row gap-x-2">
						<button
							className="btn btn-error"
							onClick={() => setIsDeletePopupOpen(true)}
						>
							削除
						</button>
						<button
							className="btn btn-outline"
							onClick={() => setIsPopupOpen(false)}
						>
							閉じる
						</button>
					</div>
				</div>
			</Popup>
			<Popup
				ref={deletePopupRef}
				title="パスワード削除"
				open={isDeletePopupOpen}
				onClose={() => setIsDeletePopupOpen(false)}
			>
				<div className="flex flex-col gap-y-2">
					<p>本当に削除しますか?</p>
					<button
						className="btn btn-error"
						onClick={async () => {
							if (popupData?.id) {
								await onDelete(popupData.id)
							}
						}}
					>
						削除
					</button>
				</div>
			</Popup>
			<Popup
				ref={createPopupRef}
				title="パスワード作成"
				open={isCreatePopupOpen}
				onClose={() => setIsCreatePopupOpen(false)}
			>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col items-center justify-center"
				>
					<TextInputField
						label="管理名"
						type="text"
						register={register('name')}
						errorMessage={errors.name?.message}
					/>
					<TextInputField
						label="パスワード"
						type="number"
						register={register('password')}
						errorMessage={errors.password?.message}
					/>
					<button type="submit" className="btn btn-primary">
						作成
					</button>
				</form>
			</Popup>
			<div className="join justify-center">
				{Array.from({ length: pageMax }, (_, i) => (
					<button
						key={i}
						className={`join-item btn ${
							currentPage === i + 1 ? 'btn-primary' : 'btn-outline'
						}`}
						onClick={() => setCurrentPage(i + 1)}
					>
						{i + 1}
					</button>
				))}
			</div>
			<button className="btn btn-outline" onClick={() => router.push('/admin')}>
				戻る
			</button>
		</div>
	)
}

export default PadLockEdit
