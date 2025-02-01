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
			<p className="text-lg mb-2">
				ログイン処理中にエラーが発生しました。Auth.js
				v5のエラーで僕にはどうしようもないです。
				<br />
				以下のボタンから再度ログインを試みてください。
			</p>
			<button onClick={() => router.push('/auth/signin')}>
				ログインしなおす
			</button>
		</div>
	)
}

export default AuthErrorPage
