import Image from 'next/image'
import Link from 'next/link'

const NotFoundImages: { id: number; src: string; score: number }[] = [
	{ id: 1, src: '/404-11.png', score: 150 },
	{ id: 2, src: '/404-12.png', score: 200 },
	{ id: 3, src: '/404-14.png', score: 100 },
	{ id: 4, src: '/404-4.png', score: 150 },
	{ id: 5, src: '/404-5.png', score: 10 },
	{ id: 6, src: '/404-6.png', score: 100 },
	{ id: 7, src: '/404-7.png', score: 30 },
	{ id: 8, src: '/404-8.png', score: 120 },
	{ id: 9, src: '/404-9.png', score: 5 },
	{ id: 10, src: '/404-10.png', score: 135 },
]

export default async function SessionForbidden() {
	// ランダムに画像を選択する
	const selectImage = async () => {
		const random = Math.floor(Math.random() * 1000) // 0~999の乱数
		let cumulativeScore = 0

		for (const image of NotFoundImages) {
			cumulativeScore += image.score
			if (random < cumulativeScore) {
				return image.src
			}
		}
		return NotFoundImages[0].src // フォールバック（安全策）
	}

	const selectedImage = await selectImage()

	return (
		<div className="flex flex-col items-center justify-center text-center">
			<div className="mb-8">
				<Image
					src={selectedImage}
					alt="403 Forbidden"
					width={400}
					height={225}
					priority
				/>
			</div>
			<h1 className="text-4xl font-bold mb-4">403 Forbidden Page</h1>
			<p className="text-lg mb-2">
				認証の必要なページです。以下よりログイン、もしくはサインインを行ってください。
			</p>
			<p className="text-xxs mb-6">
				※画像はランダムですがサーバ負荷の原因なのでリロードしないでください
				<br />
				リロードしまくった人間はIPアドレスから特定してサーバ代を請求します。
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
