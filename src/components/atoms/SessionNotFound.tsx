import Image from 'next/image'
import Link from 'next/link'

export default async function SessionForbidden() {
	return (
		<div className="flex flex-col items-center justify-center text-center">
			<div className="mb-8">
				<Image
					src={'/utils/403Error.png'}
					alt="403 Forbidden"
					width={400}
					height={225}
					priority
				/>
			</div>
			<h1 className="text-4xl font-bold mb-4">403 Forbidden Page</h1>
			<p className="text-lg mb-2">
				認証の必要なページです。以下よりログイン、もしくは利用登録を行ってください。
			</p>
			<div className="flex flex-row gap-x-2">
				<Link href="/home" className="underline">
					ホームに戻る
				</Link>
				<Link href="/auth/signin" className="underline">
					ログイン
				</Link>
			</div>
		</div>
	)
}
