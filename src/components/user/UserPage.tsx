'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import Image from 'next/image'
import { Profile, RoleMap } from '@/types/UserTypes'
import { BookingDetailProps, BuyBookingStatusMap } from '@/types/BookingTypes'
import Pagination from '@/components/atoms/Pagination'
import InstIcon from '@/components/atoms/InstIcon'
import SelectField from '@/components/atoms/SelectField'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import AddCalendarPopup from '@/components/molecules/AddCalendarPopup'
import { bookingRevalidateTagAction } from '@/components/booking/actions'

import { TiDeleteOutline } from 'react-icons/ti'

const UserPage = ({
	profile,
	session,
	bookingDataByUser,
	calendarTime,
	userRole,
}: {
	profile: Profile
	session: Session
	bookingDataByUser: BookingDetailProps[]
	calendarTime: string[]
	userRole: string
}) => {
	const router = useRouter()
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [logsPerPage, setLogsPerPage] = useState(10)
	const [popupData, setPopupData] = useState<BookingDetailProps | undefined>(
		bookingDataByUser[0],
	)
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const [isAddCalendarPopupOpen, setIsAddCalendarPopupOpen] =
		useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)
	const addCalendarPopupRef = useRef<PopupRef>(undefined)

	const pageMax = Math.ceil(bookingDataByUser.length / logsPerPage)
	const indexOfLastLog = currentPage * logsPerPage
	const indexOfFirstLog = indexOfLastLog - logsPerPage
	const currentLogs = bookingDataByUser.slice(indexOfFirstLog, indexOfLastLog)

	return (
		<div className="flex flex-col justify-center">
			<div className="flex flex-row justify-center gap-10">
				<Image
					src={session.user.image}
					alt="ユーザーアイコン"
					width={150}
					height={150}
					className="rounded-full"
					placeholder="blur"
				/>
				<div className="flex flex-col items-center justify-center">
					<div className="text-4xl font-bold">{session.user.name}</div>
					<div className="text-base">{RoleMap[profile.role]}</div>
					<InstIcon part={profile.part} size={30} />
				</div>
			</div>
			<div className="flex flex-row justify-center mt-5 gap-5">
				<div
					className="btn btn-primary"
					onClick={() => router.push('/user/edit')}
				>
					プロフィールを編集
				</div>
				<div className="btn btn-error" onClick={async () => await signOut()}>
					ログアウト
				</div>
			</div>
			<div className="mt-2 collapse collapse-arrow bg-bg-white">
				<input type="checkbox" />
				<h1 className="text-2xl font-bold collapse-title">あなたの予約一覧</h1>
				<div className="collapse-content gap-y-2 flex flex-col items-center justify-center">
					<div className="flex flex-row justify-center gap-5">
						<button
							className="btn btn-primary btn-md"
							onClick={async () =>
								await bookingRevalidateTagAction({
									tag: `booking-${session.user.id}`,
								})
							}
						>
							予約情報を更新
						</button>
						<button
							className="btn btn-outline btn-md"
							onClick={() => router.push('/booking')}
						>
							カレンダーを見る
						</button>
					</div>

					<div className="overflow-x-auto w-full flex flex-col justify-center gap-y-2">
						<div className="flex flex-row items-center ml-auto space-x-2 w-1/2">
							<p className="text-sm whitespace-nowrap">表示件数:</p>
							<SelectField
								value={logsPerPage}
								onChange={(e) => {
									setLogsPerPage(Number(e.target.value))
									setCurrentPage(1)
								}}
								options={{ 10: '10件', 20: '20件', 50: '50件', 100: '100件' }}
								name="logsPerPage"
							/>
						</div>
						<table className="table table-zebra table-sm w-full max-w-36 justify-center">
							<thead>
								<tr>
									<th className="w-16"></th>
									<th className="font-bold">予約日</th>
									<th className="font-bold">予約時間</th>
									<th className="font-bold">バンド名</th>
									<th className="font-bold">責任者</th>
								</tr>
							</thead>
							<tbody>
								{currentLogs?.map((log) => (
									<tr
										key={log.id}
										className="cursor-pointer"
										onClick={() => {
											setIsPopupOpen(true)
											setPopupData(log)
										}}
									>
										<td>
											{log.isDeleted && (
												<div className="badge badge-error text-bg-light">
													<TiDeleteOutline className="inline" />
												</div>
											)}
										</td>
										<td className="text-xxs">
											{format(log.bookingDate, 'yyyy年MM月dd日', {
												locale: ja,
											})}
										</td>
										<td className="text-xxs">
											{calendarTime[log.bookingTime]}
										</td>
										<td className="text-xxs">{log.registName}</td>
										<td className="text-xxs">{log.name}</td>
									</tr>
								))}
							</tbody>
						</table>
						<Pagination
							currentPage={currentPage}
							totalPages={pageMax}
							onPageChange={(page) => setCurrentPage(page)}
						/>

						{popupData && (
							<Popup
								ref={popupRef}
								title="予約詳細"
								maxWidth="lg"
								open={isPopupOpen}
								onClose={() => setIsPopupOpen(false)}
							>
								<div className="flex flex-col space-y-2 text-sm">
									<div className="grid grid-cols-2 gap-2">
										<div className="font-bold">予約id:</div>
										<div>{popupData.id}</div>
										<div className="font-bold">予約日:</div>
										<div>
											{format(popupData.bookingDate, 'yyyy年MM月dd日', {
												locale: ja,
											})}
										</div>
										<div className="font-bold">予約時間:</div>
										<div>{calendarTime[popupData.bookingTime]}</div>
										<div className="font-bold">バンド名:</div>
										<div>{popupData.name}</div>
										<div className="font-bold">責任者:</div>
										<div>{popupData.registName}</div>
										<div className="font-bold">作成日:</div>
										<div>
											{format(
												popupData.createdAt,
												'yyyy年MM月dd日hh時mm分ss秒',
												{
													locale: ja,
												},
											)}
										</div>
										<div className="font-bold">更新日:</div>
										<div>
											{format(
												popupData.updatedAt,
												'yyyy年MM月dd日hh時mm分ss秒',
												{
													locale: ja,
												},
											)}
										</div>
										{popupData.isPaidStatus && (
											<>
												<div className="font-bold">支払い状況:</div>
												<div>{BuyBookingStatusMap[popupData.isPaidStatus]}</div>
												<div className="font-bold">支払い期限:</div>
												<div>
													{popupData.isPaidExpired
														? format(
																new Date(popupData.isPaidExpired),
																'yyyy年MM月dd日',
																{ locale: ja },
															)
														: 'N/A'}
												</div>
											</>
										)}
									</div>
									<div className="flex justify-center space-x-2">
										<button
											type="button"
											className="btn btn-primary"
											onClick={() => setIsAddCalendarPopupOpen(true)}
										>
											カレンダーに追加する
										</button>
										<button
											className="btn btn-outline"
											onClick={() => {
												setIsPopupOpen(false)
											}}
										>
											閉じる
										</button>
									</div>
								</div>
							</Popup>
						)}
						{popupData && (
							<AddCalendarPopup
								calendarTime={calendarTime}
								bookingDetail={popupData}
								isPopupOpen={isAddCalendarPopupOpen}
								setIsPopupOpen={setIsAddCalendarPopupOpen}
								calendarAddPopupRef={addCalendarPopupRef}
							/>
						)}
					</div>
				</div>
			</div>
			<div className="flex flex-row justify-center mt-5 gap-5">
				{userRole === 'ADMIN' ||
					(userRole === 'TOPADMIN' && (
						<button
							className="btn btn-primary"
							onClick={() => router.push('/admin')}
						>
							管理者ページへ
						</button>
					))}
				{userRole === 'TOPADMIN' && (
					<button
						className="btn btn-primary"
						onClick={() => router.push('/admin/topadmin')}
					>
						トップ管理者ページへ
					</button>
				)}
			</div>
			<div className="mt-5 text-2xl text-center">---以下開発中---</div>
			<div className="flex flex-row justify-around">
				<div className="btn btn-error">アカウントを削除</div>
			</div>
		</div>
	)
}

export default UserPage
