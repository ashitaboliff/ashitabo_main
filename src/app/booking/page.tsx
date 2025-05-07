'use server'

import React from 'react'
import Image from 'next/image'
import MainPage from '@/features/booking/components/BookingMainPage'
import { notFound } from 'next/navigation'

const Page = async () => {
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
			<MainPage />
		</>
	)
}

export default Page
