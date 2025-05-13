// 'use server' // page.tsx はデフォルトでServer Component

import React from 'react'
// import Image from 'next/image' // 未使用のためコメントアウト
import MainPage from '@/features/booking/components/MainPage' // インポートパス変更
// import { notFound } from 'next/navigation' // 未使用のためコメントアウト
import { getBookingByDateAction } from '@/features/booking/components/actions'
import { DateToDayISOstring } from '@/lib/CommonFunction'
import { addDays, subDays } from 'date-fns'
import { BookingResponse } from '@/features/booking/types'

const Page = async () => {
	const viewDayMax = 7 // MainPageコンポーネントのデフォルト値と合わせる
	const yesterDate = subDays(new Date(), 1) // MainPageコンポーネントのデフォルト値と合わせる
	const initialViewDay = yesterDate

	const startDate = DateToDayISOstring(initialViewDay).split('T')[0]
	const endDate = DateToDayISOstring(addDays(initialViewDay, viewDayMax - 1)).split(
		'T',
	)[0]

	let initialBookingData: BookingResponse | undefined = undefined
	let errorStatus: number | undefined = undefined

	const res = await getBookingByDateAction({
		startDate: startDate,
		endDate: endDate,
	})

	if (res.status === 200) {
		initialBookingData = { ...res.response }
	} else {
		// エラーハンドリングはMainPage側で行うため、ここではstatusを記録する程度に留めるか、
		// 必要であればエラーページにリダイレクトするなどの処理を追加
		errorStatus = res.status
		console.error(
			`Error fetching initial booking data: ${res.status} - ${res.response}`,
		)
	}

	return (
		<>
			<div className="flex justify-center space-x-2 m-2 mt-6">
				{/* <Image
					src={'/animal_dance.png'}
					alt={'animal dance'}
					width={150}
					height={150}
				/>
				<Image
					src={'/animal_music_band.png'}
					alt={'animal dance'}
					width={150}
					height={150}
				/> */}
			</div>
			<MainPage
				initialBookingData={initialBookingData}
				initialViewDay={initialViewDay}
				errorStatus={errorStatus}
			/>
		</>
	)
}

export default Page
