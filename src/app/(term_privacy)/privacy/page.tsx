'use server'

import privacy from '@/app/(term_privacy)/privacy/privacyJson'
import { LuCalendarSync, LuCalendar } from 'react-icons/lu'
import parse from 'html-react-parser'
import { createMetaData } from '@/utils/metaData'

export async function metadata() {
	return createMetaData({
		title: 'プライバシーポリシー',
		url: '/privacy',
	})
}

const Page = async () => {
	return (
		<div className="container mx-auto bg-bg-white p-4 pb-8 rounded-lg">
			<h1 className="text-4xl font-bold text-center mt-4">
				プライバシーポリシー
			</h1>
			<div className="flex flex-col items-end">
				<div className="text-center mt-4 flex flex-row items-center gap-x-2">
					<LuCalendarSync />
					{privacy[0].updatedAt}
				</div>
				<p className="text-center flex flex-row items-center gap-x-2">
					<LuCalendar />
					{privacy[0].createdAt}
				</p>
			</div>
			<div className="mt-8">
				{privacy[0].body.map((privacy, index) => (
					<div key={index} className="mt-6">
						<h2 className="text-2xl font-bold mb-6">{privacy.subtitle}</h2>
						<div>{parse(privacy.content)}</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Page
