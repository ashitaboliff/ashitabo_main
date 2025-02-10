'use server'

import IdPage from '@/components/schedule/IdPage'
import { createMetaData } from '@/utils/MetaData'

export async function metadata() {
	return createMetaData({
		title: '日程調整詳細',
		description: `日程調整の詳細です。`,
		url: '/schedule/id',
	})
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const id = (await params).id

	return <IdPage />
}
