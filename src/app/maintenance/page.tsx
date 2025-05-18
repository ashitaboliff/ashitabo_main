import Image from 'next/image'
import { createMetaData } from '@/utils/metaData'

export async function metadata() {
	return createMetaData({
		title: 'メンテナンス中',
		description: 'ただいまメンテナンス中です。',
		url: '/maintenance',
	})
}

export default function Maintenance() {
	return (
		<div className="flex flex-col items-center justify-center text-center">
			<div className="mb-8">
				<Image
					src="/utils/test.jpg"
					alt="メンテナンス中"
					width={400}
					height={225}
					priority
				/>
			</div>
			<h1 className="text-4xl font-bold mb-4">メンテナンス中</h1>
			<p className="text-lg mb-2">ただいまメンテナンス中です。</p>
			<p className="text-xxs mb-6">しばらくお待ちください。</p>
		</div>
	)
}
