'use server'

import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const Page = () => {
	return (
		<div
			className={`flex flex-col items-center justify-center p-4 ${inter.className}`}
		>
			<div className="text-2xl font-bold">未完成</div>
			<p>間に合いませんでした。てへ</p>
			<Image
				src="/utils/test.jpg"
				alt="Under Construction"
				width={400}
				height={400}
				className="mt-2 shadow"
			/>
			<a className="btn btn-outline mt-4" href="/">
				戻る
			</a>
		</div>
	)
}

export default Page
