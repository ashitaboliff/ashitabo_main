'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import LocalFont from 'next/font/local'
import { signIn, useSession } from 'next-auth/react'
import Loading from '@/components/atoms/Loading'
import Popup, { PopupRef } from '@/components/molecules/Popup'
import HomePageHeader from '@/components/home/HomePageHeader'

const nicomoji = LocalFont({
	src: '../../lib/fonts/nicomoji-plus_v2-5.woff',
	weight: 'normal',
	style: 'normal',
	variable: '--nicomoji',
})

const SigninPage = () => {
	const session = useSession()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [popupOpen, setPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)

	if (isLoading) {
		return <Loading />
	}

	if (session.data) {
		setPopupOpen(true)
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center">
				<HomePageHeader />
				<div className="flex flex-col items-center justify-center card bg-bg-white shadow-lg w-72 h-96 my-6">
					<figure>
						<Image src="/login.jpg" alt="login" width={300} height={250} />
					</figure>
					<div className="flex flex-col items-center justify-center gap-y-2 p-4">
						<div className={`text-3xl ${nicomoji.className}`}>利用登録</div>
						<div className="text-sm">
							あしたぼの部員、およびOB,OGはこちらから利用登録、もしくはログインを行ってください。
						</div>
						<div
							className={`btn btn-primary`}
							onClick={async () =>
								await signIn('line', {
									callbackUrl: '/auth/signin/setting',
									maxAge: 6 * 30 * 24 * 60 * 60, // 6 months
								})
							}
						>
							LINEで登録
						</div>
					</div>
				</div>
				<div className="text-seconday-main text-center">
					<p>※ 利用登録にはあしたぼの部室パスワードが必要です</p>
				</div>
			</div>
			<Popup
				ref={popupRef}
				open={popupOpen}
				title="すでにログインしています"
				onClose={() => {
					setPopupOpen(false)
					router.push('/user')
				}}
			>
				<div>
					<p>すでにログインしているためアカウント登録は不要です。</p>
					<div className="flex justify-center mt-2 gap-2">
						<button
							className="btn btn-primary"
							onClick={() => {
								setPopupOpen(false)
								router.push('/user')
							}}
						>
							ユーザーページへ移動
						</button>
						<button
							className="btn btn-outline"
							onClick={() => {
								setPopupOpen(false)
								router.push('/')
							}}
						>
							ホームに戻る
						</button>
					</div>
				</div>
			</Popup>
		</>
	)
}

export default SigninPage
