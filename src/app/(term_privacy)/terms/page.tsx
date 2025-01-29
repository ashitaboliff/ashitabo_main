'use server'

import terms from '@/app/(term_privacy)/terms/termsJson'
import { LuCalendarSync, LuCalendar } from 'react-icons/lu'
import parse from 'html-react-parser'

const Page = () => {
	return (
		<div className="container mx-auto bg-bg-white p-4 pb-8 rounded-lg">
			<h1 className="text-4xl font-bold text-center mt-4">利用規約</h1>
			<div className="flex flex-col items-end">
				<div className="text-center mt-4 flex flex-row items-center gap-x-2">
					<LuCalendarSync />
					{terms[0].updatedAt}
				</div>
				<p className="text-center flex flex-row items-center gap-x-2">
					<LuCalendar />
					{terms[0].createdAt}
				</p>
			</div>
			<div className="mt-8">
				{terms[0].body.map((term, index) => (
					<div key={index} className="mt-6">
						<h2 className="text-2xl font-bold mb-6">{term.subtitle}</h2>
						<div>{parse(term.content)}</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Page
