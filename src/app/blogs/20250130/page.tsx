'use server'

import blogs from '@/app/blogs/20250130/blogsJson'
import { LuCalendarSync, LuCalendar } from 'react-icons/lu'
import parse from 'html-react-parser'
import { createMetaData } from '@/utils/metaData'

export async function metadata() {
	return createMetaData({
		title: 'アップデートのお知らせ(2025/01/30)',
		description:
			'あしたぼホームページ2025年1月の大型アップデートのお知らせです。',
		url: '/blogs/20250130',
	})
}

const Page = async () => {
	return (
		<div className="container mx-auto bg-white p-4 pb-8 rounded-lg">
			<h1 className="text-3xl font-bold text-center mt-4">
				アップデートのお知らせ
			</h1>
			<div className="flex flex-col items-end">
				<div className="text-center mt-4 flex flex-row items-center gap-x-2">
					<LuCalendarSync />
					{blogs[0].updatedAt}
				</div>
				<p className="text-center flex flex-row items-center gap-x-2">
					<LuCalendar />
					{blogs[0].createdAt}
				</p>
			</div>
			<div className="mt-8">
				{blogs[0].body.map((blogs, index) => (
					<div key={index} className="mt-6">
						<h2 className="text-lg font-bold mb-6">{blogs.subtitle}</h2>
						<div>{parse(blogs.content)}</div>
					</div>
				))}
			</div>
			<div className="flex flex-row justify-center mt-5 gap-5">
				<a className="btn btn-outline" href="/home">
					ホームに戻る
				</a>
			</div>
		</div>
	)
}

export default Page
