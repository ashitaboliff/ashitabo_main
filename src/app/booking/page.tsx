'use server'

import React from 'react'
import Image from 'next/image'
import { getCalendarTimeAction } from '@/components/booking/actions'
import MainPage from '@/components/booking/BookingMainPage'
import HomePageHeader from '@/components/home/HomePageHeader'
import { notFound } from 'next/navigation'

const Page = async () => {
	const calendarTime = await getCalendarTimeAction()
	if (calendarTime.status !== 200) {
		return notFound()
	}
	return (
		<>
			<HomePageHeader />
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
			<MainPage calendarTime={calendarTime.response} />
		</>
	)
}

export default Page
