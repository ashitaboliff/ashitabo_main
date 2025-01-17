import { DateToDayISOstring } from '@/lib/CommonFunction'
import { updateBuyBookingAction } from '@/schedule/actions'

export async function LocalUpdateBuyStateFunction() {
	console.log('LocalUpdateBuyStateFunction')
	const expireAt = DateToDayISOstring(new Date())
	await updateBuyBookingAction(expireAt)
}
