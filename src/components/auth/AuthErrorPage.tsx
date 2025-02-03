'use client'

import { useRouter } from 'next-nprogress-bar'
import Image from 'next/image'

const AuthErrorPage = ({ error }: { error: string }) => {
	const router = useRouter()
	console.log(error)

	return (
		<div className="flex flex-col items-center justify-center text-center">
			<div className="mb-8">
				<Image
					src={'/500Error.png'}
					alt="500 Internal Server Error"
					width={400}
					height={225}
					priority
				/>
			</div>
			<p className="text-4xl font-bold mb-4">500 Internal Server Error</p>
			<p className="text-base mb-2">
				ログイン処理中にエラーが発生しました。
				<a href="https://authjs.dev/" className="underline">
					Auth.js v5
				</a>
				の不具合で僕にはどうしようもないです。
				<br />
				以下のボタンから再度ログインを試みてください。
			</p>
			<button
				className="btn btn-primary"
				onClick={() => router.push('/auth/signin')}
			>
				ログインしなおす
			</button>
		</div>
	)
}

export default AuthErrorPage
