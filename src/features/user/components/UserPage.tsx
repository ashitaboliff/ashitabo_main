'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { Session } from 'next-auth'
import { signOutUser } from '@/features/user/actions'
import Image from 'next/image' // next/imageをインポート
import { Profile } from '@/features/user/types'
import { StatusCode } from '@/utils/types/responseTypes' // StatusCodeをインポート
import { Tabs, Tab } from '@/components/ui/atoms/Tabs'
import ProfileDisplay from './ProfileDisplay' // 新しいコンポーネントをインポート
import LocalFont from 'next/font/local'
import Popup, { PopupRef } from '@/components/ui/molecules/Popup'
import GachaSelectPopup, {
	GachaSelectPopupRef,
} from '@/features/gacha/components/GachaSelectPopup'
import BookingLogs from '@/features/user/components/BookingLogs'
import GachaLogs from '@/features/user/components/GachaLogs'
// import { checkGachaCookieAction } from '@/features/gacha/components/actions' // 不要なため削除

import { GiCardRandom } from 'react-icons/gi'
import { MdOutlineEditCalendar } from 'react-icons/md'

const gkktt = LocalFont({
	src: '../../../lib/fonts/851Gkktt_005.woff',
	weight: 'normal',
	style: 'normal',
	variable: '--851-gkktt',
})

const UserPage = ({
	profile,
	session,
	userRole,
	gachaStatus, // gachaStatusをpropsとして受け取る
}: {
	profile: Profile
	session: Session
	userRole: string
	gachaStatus: { status: StatusCode; response: string } // gachaStatusの型定義
}) => {
	const router = useRouter()

	const [isGachaPopupOpen, setIsGachaPopupOpen] = useState<boolean>(false)
	const gachaPopupRef = useRef<GachaSelectPopupRef>(undefined)
	// gachaCount の useState と関連処理を削除
	// const [gachaCount, setGachaCount] = useState<number>(0)

	const [isProvRatioPopupOpen, setIsProvRatioPopupOpen] =
		useState<boolean>(false)
	const provRatioPopupRef = useRef<PopupRef>(undefined)

	const canPlayGacha = gachaStatus.status === StatusCode.OK

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
					<Tab label={<MdOutlineEditCalendar size={24} />}>
						<BookingLogs session={session} />
					</Tab>
					<Tab label={<GiCardRandom size={24} />}>
						<div className="flex flex-col items-center mb-4 gap-y-2">
							<div className="flex flex-col sm:flex-row justify-center gap-2 w-full">
								<button
									className="btn btn-primary w-full sm:w-auto"
									onClick={() => {
										setIsGachaPopupOpen(true)
										// router.refresh() // ガチャを引いた後にページをリフレッシュして状態を更新
									}}
									disabled={!canPlayGacha} // gachaStatusに基づいてdisabledを制御
								>
									ガチャを引く
								</button>
								<button
									className="btn btn-outline w-full sm:w-auto"
									onClick={() => setIsProvRatioPopupOpen(true)}
								>
									提供割合
								</button>
							</div>
							{!canPlayGacha && ( // gachaStatusに基づいてメッセージを表示
								<div className="text-error text-center mt-2">
									{gachaStatus.response}
								</div>
							)}
						</div>
						<GachaLogs session={session} />
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
