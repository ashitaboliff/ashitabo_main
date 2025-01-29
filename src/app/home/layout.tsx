import type { Metadata } from 'next'
import LocalFont from 'next/font/local'
import HomePageHeader from '@/components/home/HomePageHeader'

const gkktt = LocalFont({
	src: '../../lib/fonts/851Gkktt_005.woff',
	weight: 'normal',
	style: 'normal',
	variable: '--851-gkktt',
})

export const metadata: Metadata = {
	title: 'あしたぼホームページ',
	description:
		'信州大学工学部の軽音サークル、あしたぼの公式ホームページです。信州大学工学部の生徒の他に信州大学教育学部、長野県立大学の生徒が活動しています。',
}

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
