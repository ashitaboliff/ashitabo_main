'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { Session } from 'next-auth'
import { signOutUser } from '@/features/user/actions'
import Image from 'next/image'
import { Profile } from '@/features/user/types'
import { Booking } from '@/features/booking/types'
import { GachaData, GachaSort } from '@/features/gacha/types'
import { Tabs, Tab } from '@/components/ui/atoms/Tabs'
import ProfileDisplay from './ProfileDisplay'
import LocalFont from 'next/font/local'
import Popup, { PopupRef } from '@/components/ui/molecules/Popup'
import GachaSelectPopup, {
	GachaSelectPopupRef,
} from '@/features/gacha/components/GachaSelectPopup'
import BookingLogs from '@/features/user/components/BookingLogs'
import GachaLogs from '@/features/user/components/GachaLogs'

import { GiCardRandom } from 'react-icons/gi'
import { MdOutlineEditCalendar } from 'react-icons/md'

const gkktt = LocalFont({
	src: '../../../lib/fonts/851Gkktt_005.woff',
	weight: 'normal',
	style: 'normal',
	variable: '--851-gkktt',
})

interface UserPageProps {
	profile: Profile
	session: Session
	userRole: string
	initialBookings: Booking[]
	initialPageMax: number
	initialCurrentPage: number
	initialLogsPerPage: number
	initialSort: 'new' | 'old'
	// Gacha Logs Props
	initialGachas: GachaData[]
	initialGachaPageMax: number
	initialGachaCurrentPage: number
	initialGachaLogsPerPage: number
	initialGachaSort: GachaSort
}

const UserPage = ({
	profile,
	session,
	userRole,
	initialBookings,
	initialPageMax,
	initialCurrentPage,
	initialLogsPerPage,
	initialSort,
	initialGachas,
	initialGachaPageMax,
	initialGachaCurrentPage,
	initialGachaLogsPerPage,
	initialGachaSort,
}: UserPageProps) => {
	const router = useRouter()

	const [isGachaPopupOpen, setIsGachaPopupOpen] = useState<boolean>(false)
	const gachaPopupRef = useRef<GachaSelectPopupRef>(undefined)

	const [isProvRatioPopupOpen, setIsProvRatioPopupOpen] =
		useState<boolean>(false)
	const provRatioPopupRef = useRef<PopupRef>(undefined)

	const [gachaPlayCountToday, setGachaPlayCountToday] = useState<number>(0)
	const [lastGachaDateString, setLastGachaDateString] = useState<string>('')
	const [gachaMessage, setGachaMessage] = useState<string>('')
	const MAX_GACHA_PLAYS_PER_DAY = 3

	useEffect(() => {
		const today = new Date().toISOString().split('T')[0]
		const storedDate = localStorage.getItem('gachaLastPlayedDate')
		const storedCount = parseInt(
			localStorage.getItem('gachaPlayCountToday') || '0',
			10,
		)

		if (storedDate === today) {
			setGachaPlayCountToday(storedCount)
		} else {
			// 日付が変わっていたらリセット
			localStorage.setItem('gachaPlayCountToday', '0')
			localStorage.setItem('gachaLastPlayedDate', today)
			setGachaPlayCountToday(0)
		}
		setLastGachaDateString(today)
	}, [])

	const canPlayGacha = gachaPlayCountToday < MAX_GACHA_PLAYS_PER_DAY

	useEffect(() => {
		if (!canPlayGacha) {
			setGachaMessage(
				`本日は既にガチャを${MAX_GACHA_PLAYS_PER_DAY}回引いているため、これ以上引くことはできません。`,
			)
		} else {
			setGachaMessage('')
		}
	}, [canPlayGacha, gachaPlayCountToday])

	const handlePlayGacha = async () => {
		const today = new Date().toISOString().split('T')[0]
		let currentCount = gachaPlayCountToday
		let currentDateString = lastGachaDateString

		// localStorageから最新情報を取得して再チェック (念のため)
		const storedDate = localStorage.getItem('gachaLastPlayedDate')
		const storedCount = parseInt(
			localStorage.getItem('gachaPlayCountToday') || '0',
			10,
		)

		if (storedDate === today) {
			currentCount = storedCount
		} else {
			currentCount = 0 // 日付が変わっていたらリセット
		}
		currentDateString = today

		if (currentCount < MAX_GACHA_PLAYS_PER_DAY) {
			setIsGachaPopupOpen(true)
		} else {
			setGachaMessage(
				`本日は既にガチャを${MAX_GACHA_PLAYS_PER_DAY}回引いているため、これ以上引くことはできません。`,
			)
		}
	}

	const onGachaPlayedSuccessfully = () => {
		const today = new Date().toISOString().split('T')[0]
		const newCount = gachaPlayCountToday + 1
		localStorage.setItem('gachaPlayCountToday', newCount.toString())
		localStorage.setItem('gachaLastPlayedDate', today)
		setGachaPlayCountToday(newCount)
		setLastGachaDateString(today)
		router.refresh() // ガチャログなどを更新するためにリフレッシュ
	}

	return (
		<div className="container mx-auto p-4 flex flex-col items-center">
			<ProfileDisplay profile={profile} session={session} />
			<button
				className="btn btn-outline btn-primary w-full md:w-1/2 lg:w-1/3 mb-4"
				onClick={() => router.push('/user/edit')}
			>
				プロフィールを編集
			</button>
			{userRole === 'ADMIN' && (
				<button
					className="btn btn-secondary btn-outline w-full md:w-1/2 lg:w-1/3 mb-4"
					onClick={() => router.push('/admin')}
				>
					管理者ページへ
				</button>
			)}
			{userRole === 'TOPADMIN' && (
				<div className="flex flex-col md:flex-row justify-center gap-2 mb-4 w-full md:w-2/3 lg:w-1/2">
					<button
						className="btn btn-accent btn-outline w-full md:w-1/2"
						onClick={() => router.push('/admin')}
					>
						管理者ページ
					</button>
					<button
						className="btn btn-accent btn-outline w-full md:w-1/2"
						onClick={() => router.push('/admin/topadmin')}
					>
						トップ管理者ページ
					</button>
				</div>
			)}
			<div className="w-full">
				<Tabs>
					<Tab label={<MdOutlineEditCalendar size={30} />}>
						<BookingLogs
							session={session}
							initialBookings={initialBookings}
							initialPageMax={initialPageMax}
							initialCurrentPage={initialCurrentPage}
							initialLogsPerPage={initialLogsPerPage}
							initialSort={initialSort}
						/>
					</Tab>
					<Tab label={<GiCardRandom size={30} />}>
						<div className="flex flex-col items-center mb-4 gap-y-2">
							<div className="flex flex-col sm:flex-row justify-center gap-2 w-full">
								<button
									className="btn btn-primary w-full sm:w-auto"
									onClick={handlePlayGacha}
									disabled={!canPlayGacha}
								>
									ガチャを引く ({MAX_GACHA_PLAYS_PER_DAY - gachaPlayCountToday}
									回残)
								</button>
								<button
									className="btn btn-outline w-full sm:w-auto"
									onClick={() => setIsProvRatioPopupOpen(true)}
								>
									提供割合
								</button>
							</div>
							{gachaMessage && (
								<div className="text-error text-center mt-2">
									{gachaMessage}
								</div>
							)}
						</div>
						<GachaLogs
							session={session}
							initialGachas={initialGachas}
							initialPageMax={initialGachaPageMax}
							initialCurrentPage={initialGachaCurrentPage}
							initialLogsPerPage={initialGachaLogsPerPage}
							initialSort={initialGachaSort}
						/>
					</Tab>
				</Tabs>
			</div>
			<div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 w-full md:w-1/2 lg:w-1/3">
				<button
					className="btn btn-error btn-outline w-full sm:w-1/2"
					onClick={signOutUser}
				>
					ログアウト
				</button>
				<button className="btn btn-disabled w-full sm:w-1/2" disabled>
					アカウントを削除
				</button>
			</div>
			<GachaSelectPopup
				open={isGachaPopupOpen}
				onClose={() => setIsGachaPopupOpen(false)}
				ref={gachaPopupRef}
				onGachaSuccess={onGachaPlayedSuccessfully} // 成功時のコールバックを渡す
				userId={session?.user?.id} // userIdを渡す
			/>
			<Popup
				id="prov-ratio-popup" // idプロパティを追加
				title="提供割合"
				ref={provRatioPopupRef}
				open={isProvRatioPopupOpen}
				onClose={() => setIsProvRatioPopupOpen(false)}
			>
				<div className="flex flex-col items-center space-y-2 text-sm">
					<div
						className={`bg-white px-4 rounded-lg shadow-md w-full text-2xl ${gkktt.className}`}
					>
						COMMON
					</div>
					<div className="flex flex-row my-2 w-full">
						<Image
							src="/gacha/preset/Common.png"
							width={72}
							height={104}
							alt="COMMON"
							className="basis-1/4 bg-base-content rounded-sm mr-4"
						/>
						<div className="flex flex-col justify-center gap-y-1 basis-2/3">
							<div>全体確率: 45%</div>
							<div>封入数: 20枚</div>
							<div>一枚当たりの確率: 2.25%</div>
						</div>
					</div>
					<div
						className={`bg-white px-4 rounded-lg shadow-md w-full text-2xl ${gkktt.className} mt-4`}
					>
						RARE
					</div>
					<div className="flex flex-row my-2 w-full">
						<Image
							src="/gacha/preset/Rare.png"
							width={72}
							height={104}
							alt="RARE"
							className="basis-1/4 bg-base-content rounded-sm mr-4"
						/>
						<div className="flex flex-col justify-center gap-y-1 basis-2/3">
							<div>全体確率: 30%</div>
							<div>封入数: 15枚</div>
							<div>一枚当たりの確率: 2%</div>
						</div>
					</div>
					<div
						className={`bg-white px-4 rounded-lg shadow-md w-full text-2xl ${gkktt.className} mt-4`}
					>
						SURER RARE
					</div>
					<div className="flex flex-row my-2 w-full">
						<Image
							src="/gacha/preset/SR.png"
							width={72}
							height={104}
							alt="SURER RARE"
							className="basis-1/4 bg-base-content rounded-sm mr-4"
						/>
						<div className="flex flex-col justify-center gap-y-2 basis-2/3">
							<div>全体確率: 17%</div>
							<div>封入数: 10枚</div>
							<div>一枚当たりの確率: 1.7%</div>
						</div>
					</div>
					<div
						className={`bg-white px-4 rounded-lg shadow-md w-full text-2xl ${gkktt.className} mt-4`}
					>
						SSR
					</div>
					<div className="flex flex-row my-2 w-full">
						<Image
							src="/gacha/preset/SSR.png"
							width={72}
							height={104}
							alt="SSR"
							className="basis-1/4 bg-base-content rounded-sm mr-4"
						/>
						<div className="flex flex-col justify-center gap-y-2 basis-2/3">
							<div>全体確率: 6.5%</div>
							<div>封入数: 5枚</div>
							<div>一枚当たりの確率: 1.3%</div>
						</div>
					</div>
					<div
						className={`bg-white px-4 rounded-lg shadow-md w-full text-2xl ${gkktt.className} mt-4`}
					>
						ULTRA RARE
					</div>
					<div className="flex flex-row my-2 w-full">
						<Image
							src="/gacha/preset/UR.png"
							width={72}
							height={104}
							alt="ULTRA RARE"
							className="basis-1/4 bg-base-content rounded-sm mr-4"
						/>
						<div className="flex flex-col justify-center gap-y-2 basis-2/3">
							<div>全体確率: 1%</div>
							<div>封入数: 2枚</div>
							<div>一枚当たりの確率: 0.5%</div>
						</div>
					</div>
				</div>
				<div className="flex flex-row justify-center gap-x-4 mt-4">
					<button
						className="btn btn-outline"
						onClick={() => setIsProvRatioPopupOpen(false)}
					>
						閉じる
					</button>
				</div>
			</Popup>
		</div>
	)
}

export default UserPage
