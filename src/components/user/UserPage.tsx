'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { Session } from 'next-auth'
import { signOutUser } from './action'
import Image from 'next/image'
import { Profile, RoleMap } from '@/types/UserTypes'
import InstIcon from '@/components/atoms/InstIcon'
import { Tabs, Tab } from '@/components/atoms/Tabs'
import LocalFont from 'next/font/local'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import GachaSelectPopup, {
	GachaSelectPopupRef,
} from '@/components/gacha/GachaSelectPopup'
import UserBookingLogs from '@/components/user/UserBookingLogs'
import UserGachaLogs from '@/components/user/UserGachaLogs'
import { checkGachaCookieAction } from '@/components/gacha/actions'

import { GiCardRandom } from 'react-icons/gi'
import { MdOutlineEditCalendar } from 'react-icons/md'

const gkktt = LocalFont({
	src: '../../lib/fonts/851Gkktt_005.woff',
	weight: 'normal',
	style: 'normal',
	variable: '--851-gkktt',
})

const UserPage = ({
	profile,
	session,
	userRole,
}: {
	profile: Profile
	session: Session
	userRole: string
}) => {
	const router = useRouter()

	const [isGachaPopupOpen, setIsGachaPopupOpen] = useState<boolean>(false)
	const gachaPopupRef = useRef<GachaSelectPopupRef>(undefined)
	const [gachaCount, setGachaCount] = useState<number>(0)

	const [isProvRatioPopupOpen, setIsProvRatioPopupOpen] =
		useState<boolean>(false)
	const provRatioPopupRef = useRef<PopupRef>(undefined)

	useEffect(() => {
		async function checkGachaCookie() {
			const res = await checkGachaCookieAction()
			if (res.status !== 200) {
				setGachaCount(100)
			}
		}
		checkGachaCookie()
	}, [gachaCount])

	return (
		<div className="flex flex-col justify-center">
			<div className="flex flex-row justify-center gap-10 mb-4 p-6 bg-bg-white rounded-lg shadow-md">
				<Image
					src={session.user.image}
					alt="ユーザーアイコン"
					width={150}
					height={150}
					className="rounded-full"
				/>
				<div className="flex flex-col items-center justify-center">
					<div className="text-4xl font-bold">{session.user.name}</div>
					<div className="text-base">{RoleMap[profile.role]}</div>
					<InstIcon part={profile.part} size={30} />
				</div>
			</div>
			<button
				className="btn btn-outline"
				onClick={() => router.push('/user/edit')}
			>
				プロフィールを編集
			</button>
			{userRole === 'ADMIN' && (
				<button
					className="btn btn-secondary btn-outline w-1/2 my-2 mx-auto"
					onClick={() => router.push('/admin')}
				>
					管理者ページへ
				</button>
			)}
			{userRole === 'TOPADMIN' && (
				<div className="flex flex-row justify-center gap-2 my-2">
					<button
						className="btn btn-secondary btn-outline w-5/12"
						onClick={() => router.push('/admin')}
					>
						管理者ページ
					</button>
					<button
						className="btn btn-secondary btn-outline w-5/12"
						onClick={() => router.push('/admin/topadmin')}
					>
						トップ管理者ページ
					</button>
				</div>
			)}
			<Tabs>
				<Tab label={<MdOutlineEditCalendar size={30} />}>
					<UserBookingLogs session={session} />
				</Tab>
				<Tab label={<GiCardRandom size={30} />}>
					<div className="flex flex-col justify-center mb-2 gap-y-2">
						<div className="flex flex-row justify-center gap-x-2">
							<button
								className="btn btn-primary"
								onClick={() => {
									setIsGachaPopupOpen(true)
									setGachaCount(gachaCount + 1)
								}}
								disabled={gachaCount === 100}
							>
								ガチャを引く
							</button>
							<button
								className="btn btn-outline"
								onClick={() => setIsProvRatioPopupOpen(true)}
							>
								提供割合
							</button>
						</div>
						{gachaCount === 100 && (
							<div className="text-error text-center">
								本日のガチャは終了しました
							</div>
						)}
					</div>
					<UserGachaLogs session={session} />
				</Tab>
			</Tabs>
			<div className="flex flex-row justify-center gap-x-4">
				<button className="btn btn-error" onClick={signOutUser}>
					ログアウト
				</button>
				<button className="btn btn-error" disabled>
					アカウントを削除
				</button>
			</div>
			<GachaSelectPopup
				open={isGachaPopupOpen}
				onClose={() => setIsGachaPopupOpen(false)}
				ref={gachaPopupRef}
			/>
			<Popup
				title="提供割合"
				ref={provRatioPopupRef}
				open={isProvRatioPopupOpen}
				onClose={() => setIsProvRatioPopupOpen(false)}
			>
				<div className="flex flex-col items-center space-y-2 text-sm">
					<div
						className={`bg-bg-white px-4 rounded-lg shadow-md w-full text-2xl ${gkktt.className}`}
					>
						COMMON
					</div>
					<div className="flex flex-row my-2 w-full">
						<Image
							src="/gacha/preset/Common.png"
							width={72}
							height={104}
							alt="COMMON"
							className="basis-1/4 bg-bg-dark rounded-sm mr-4"
						/>
						<div className="flex flex-col justify-center gap-y-1 basis-2/3">
							<div>全体確率: 45%</div>
							<div>封入数: 20枚</div>
							<div>一枚当たりの確率: 2.25%</div>
						</div>
					</div>
					<div
						className={`bg-bg-white px-4 rounded-lg shadow-md w-full text-2xl ${gkktt.className} mt-4`}
					>
						RARE
					</div>
					<div className="flex flex-row my-2 w-full">
						<Image
							src="/gacha/preset/Rare.png"
							width={72}
							height={104}
							alt="RARE"
							className="basis-1/4 bg-bg-dark rounded-sm mr-4"
						/>
						<div className="flex flex-col justify-center gap-y-1 basis-2/3">
							<div>全体確率: 30%</div>
							<div>封入数: 15枚</div>
							<div>一枚当たりの確率: 2%</div>
						</div>
					</div>
					<div
						className={`bg-bg-white px-4 rounded-lg shadow-md w-full text-2xl ${gkktt.className} mt-4`}
					>
						SURER RARE
					</div>
					<div className="flex flex-row my-2 w-full">
						<Image
							src="/gacha/preset/SR.png"
							width={72}
							height={104}
							alt="SURER RARE"
							className="basis-1/4 bg-bg-dark rounded-sm mr-4"
						/>
						<div className="flex flex-col justify-center gap-y-2 basis-2/3">
							<div>全体確率: 17%</div>
							<div>封入数: 10枚</div>
							<div>一枚当たりの確率: 1.7%</div>
						</div>
					</div>
					<div
						className={`bg-bg-white px-4 rounded-lg shadow-md w-full text-2xl ${gkktt.className} mt-4`}
					>
						SSR
					</div>
					<div className="flex flex-row my-2 w-full">
						<Image
							src="/gacha/preset/SSR.png"
							width={72}
							height={104}
							alt="SSR"
							className="basis-1/4 bg-bg-dark rounded-sm mr-4"
						/>
						<div className="flex flex-col justify-center gap-y-2 basis-2/3">
							<div>全体確率: 6.5%</div>
							<div>封入数: 5枚</div>
							<div>一枚当たりの確率: 1.3%</div>
						</div>
					</div>
					<div
						className={`bg-bg-white px-4 rounded-lg shadow-md w-full text-2xl ${gkktt.className} mt-4`}
					>
						ULTRA RARE
					</div>
					<div className="flex flex-row my-2 w-full">
						<Image
							src="/gacha/preset/UR.png"
							width={72}
							height={104}
							alt="ULTRA RARE"
							className="basis-1/4 bg-bg-dark rounded-sm mr-4"
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
