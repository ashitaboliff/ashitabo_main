'use server'

import Image from 'next/image'
import { Inter } from 'next/font/google'
import { createMetaData } from '@/utils/MetaData'
import HomePageHeader from '@/components/home/HomePageHeader'

const inter = Inter({ subsets: ['latin'] })

export async function metadata() {
	return createMetaData({
		title: 'あしたぼからのおしらせ',
		description: '信州大学工学部軽音サークルあしたぼからのおしらせです。',
		url: '/home/blogs',
	})
}

const Page = async () => {
	return (
		<>
			<HomePageHeader />
			<div
				className={`flex flex-col items-center justify-center p-4 gap-y-2 ${inter.className}`}
			>
				<a className="underline" href="/blogs/20250130">
					2025年1月30日のアップデートのお知らせ
				</a>
				<a className="underline" href="/blogs/20250216">
					2025年2月16日のアップデートのお知らせ
				</a>
				<a className="btn btn-outline mt-4" href="/">
					戻る
				</a>
			</div>
		</>
	)
}

export default Page
