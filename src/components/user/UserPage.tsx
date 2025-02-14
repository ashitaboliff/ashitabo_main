'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { Session } from 'next-auth'
import { signOutUser } from './action'
import Image from 'next/image'
import { Profile, RoleMap } from '@/types/UserTypes'
import InstIcon from '@/components/atoms/InstIcon'
import { Tabs, Tab } from '@/components/atoms/Tabs'
import GachaPickupPopup, {
	GachaPickupPopupRef,
} from '@/components/gacha/GachaPickupPopup'
import UserBookingLogs from '@/components/user/UserBookingLogs'
import UserGachaLogs from '@/components/user/UserGachaLogs'
import { checkGachaCookieAction } from '@/components/gacha/actions'

import { GiCardRandom } from 'react-icons/gi'
import { MdOutlineEditCalendar } from 'react-icons/md'

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
	const gachaPopupRef = useRef<GachaPickupPopupRef>(undefined)
	const [gachaCount, setGachaCount] = useState<number>(0)

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
			{isGachaPopupOpen && (
				<GachaPickupPopup
					createType="user"
					ref={gachaPopupRef}
					open={isGachaPopupOpen}
					onClose={() => setIsGachaPopupOpen(false)}
				/>
			)}
		</div>
	)
}

export default UserPage
