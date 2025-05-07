'use client'

import { useRouter } from 'next-nprogress-bar'
import InfoMessage from '@/components/atoms/InfoMessage'

/**
 * 予約情報が見つからなかった場合のコンポーネント、静的
 */
const BookingDetailNotFound = () => {
	const router = useRouter()

	return (
		<div className="p-4 flex flex-col items-center justify-center">
			<div className="p-4 flex flex-col justify-center gap-2">
				<InfoMessage
					message={
						<p>
							予約情報が見つかりませんでした。
							<br />
							ホームに戻ってもう一度試してください。
						</p>
					}
					messageType="error"
					IconColor="bg-white"
				/>
				<button
					className="btn btn-outline"
					onClick={() => router.push('/booking')}
				>
					ホームに戻る
				</button>
			</div>
		</div>
	)
}

export default BookingDetailNotFound
