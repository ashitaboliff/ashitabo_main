'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Loading from '@/components/atoms/Loading'
import Popup, { PopupRef } from '@/components/molecules/Popup'

const SigninPage = () => {
	const session = useSession()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [popupOpen, setPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<PopupRef>(undefined)

	if (isLoading) {
		return <Loading />
	}

	useEffect(() => {
		if (session.data) {
			setPopupOpen(true)
		}
	}, [session])

	return (
		<>
			<div className="flex flex-col items-center justify-center p-4">
				<div className="text-2xl font-bold">ログイン</div>
				<div
					className="btn btn-primary"
					onClick={() =>
						signIn('line', {
							redirectTo: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin/setting`,
							maxAge: 6 * 30 * 24 * 60 * 60, // 6 months
						})
					}
				>
					LINEでログイン
				</div>
			</div>
			<Popup
				ref={popupRef}
				open={popupOpen}
				title="すでにログインしています"
				children={
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
				}
				onClose={() => {
					setPopupOpen(false)
					router.push('/user')
				}}
			/>
		</>
	)
}

export default SigninPage
