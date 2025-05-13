import { DateToDayISOstring } from '@/lib/CommonFunction'
import { updateBuyBookingAction } from '@/features/schedule/actions/actions'

export async function LocalUpdateBuyStateFunction() {
	console.log('LocalUpdateBuyStateFunction')
	const expireAt = DateToDayISOstring(new Date())
	await updateBuyBookingAction(expireAt)
}
