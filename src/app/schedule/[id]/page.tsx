'use server'

import IdPage from '@/components/schedule/IdPage'
import SessionForbidden from '@/components/atoms/SessionNotFound'
import { getScheduleByIdAction } from '@/components/schedule/actions'
import { getSession, sessionCheck, redirectFrom } from '@/app/actions'
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

  const session = await getSession()
  const isSession = await sessionCheck(session)

  if (isSession !== 'profile' || !session) {
    await redirectFrom('/auth/signin', '/schedule/new')
    return <SessionForbidden />
  }

  const schedule = await getScheduleByIdAction(id)
  if(schedule.status !== 200) {
    return <div>Not Found</div>
  }

  if (schedule.response.mention.length !== 0 && (schedule.response.mention.filter((mention) => mention === session.user.id).length === 0 || schedule.response.userId !== session.user.id)) {
    return <div>Not Found</div>
  }

	return <IdPage />
}

export default Page