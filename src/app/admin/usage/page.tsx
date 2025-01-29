'use server'

import usage from '@/app/admin/usage/usageJson'
import { LuCalendarSync, LuCalendar } from 'react-icons/lu'
import parse from 'html-react-parser'

const Page = () => {
	return (
		<div className="container mx-auto bg-bg-white p-4 pb-8 rounded-lg">
			<h1 className="text-4xl font-bold text-center mt-4">
				管理者ページの使い方
			</h1>
			<div className="flex flex-col items-end">
				<div className="text-center mt-4 flex flex-row items-center gap-x-2">
					<LuCalendarSync />
					{usage[0].updatedAt}
				</div>
				<p className="text-center flex flex-row items-center gap-x-2">
					<LuCalendar />
					{usage[0].createdAt}
				</p>
			</div>
			<div className="mt-8">
				{usage[0].body.map((usage, index) => (
					<div key={index} className="mt-6">
						<h2 className="text-2xl font-bold mb-6">{usage.subtitle}</h2>
						<div>{parse(usage.content)}</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Page
