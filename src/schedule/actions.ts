'use server'

import { ApiResponse, StatusCode } from '@/types/ResponseTypes'
import { revalidateTag } from 'next/cache'
import { getBuyBookingByExpire } from '@/db/Booking'

export async function updateBuyBookingAction(
	expireAt: string,
): Promise<ApiResponse<string>> {
	try {
		const buyBooking = await getBuyBookingByExpire(expireAt) // 期限切れの予約を取得

		// 非同期処理を待機する
		// await Promise.all(
		// 	buyBooking.map(async (booking) => {
		// 		await updateBuyBooking({ bookingId: booking.id, state: 'EXPIRED' })
		// 	}),
		// )

		revalidateTag('booking')

		return { status: StatusCode.OK, response: '予約を更新しました' }
	} catch (error) {
		return {
			status: StatusCode.INTERNAL_SERVER_ERROR,
			response: String(error),
		}
	}
}
