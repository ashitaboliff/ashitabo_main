'use client'

import { useState } from 'react'
import { BookingDetailProps } from '@/features/booking/types'
import EditAuthPage from '@/features/booking/components/EditAuth'
import EditFormPage from '@/features/booking/components/EditForm' // インポート名とパスを変更
import { Session } from 'next-auth'

const EditPage = ({
	bookingDetail,
	session,
}: {
	bookingDetail: BookingDetailProps
	session: Session
}) => {
	const [isAuth, setIsAuth] = useState<boolean>(
		bookingDetail.userId === session?.user.id,
	)

	return (
		<div className="flex-col">
			{isAuth ? (
				<EditFormPage bookingDetail={bookingDetail} session={session} />
			) : (
				<EditAuthPage handleSetAuth={setIsAuth} bookingDetail={bookingDetail} />
			)}
		</div>
	)
}

export default EditPage
