import LocalFont from 'next/font/local'
import HomePageHeader from '@/components/home/HomePageHeader'
import { createMetaData } from '@/utils/metaData'

const gkktt = LocalFont({
	src: '../../lib/fonts/851Gkktt_005.woff',
	weight: 'normal',
	style: 'normal',
	variable: '--851-gkktt',
})

export const metadata = createMetaData({
	title: 'ホーム',
	url: '/home',
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className={gkktt.className}>
			<HomePageHeader />
			{children}
		</div>
	)
}
