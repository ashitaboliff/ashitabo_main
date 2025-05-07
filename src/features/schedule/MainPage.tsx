'use client'

import { useRouter } from 'next-nprogress-bar'

const ScheduleMainPage = () => {
	const router = useRouter()
	return (
		<div className="flex flex-col justify-center items-center gap-y-4">
			<p className="text-2xl font-bold">日程調整</p>
			<p>
				バンドでの練習日やライブ日、その他あしたぼ内部での日程調整に使ってください
			</p>
			<button
				className="btn btn-primary mt-4"
				onClick={() => router.push('/schedule/new')}
			>
				新規作成
			</button>
		</div>
	)
}

export default ScheduleMainPage
