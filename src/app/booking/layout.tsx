import { Inter } from 'next/font/google'
import { createMetaData } from '@/utils/metaData'
import HomePageHeader from '@/components/home/HomePageHeader'

const inter = Inter({ subsets: ['latin'] })

export const metadata = createMetaData({
	title: 'あしたぼコマ表',
	description: 'こちらからあしたぼ内でのサークル棟音楽室の予約が可能です。',
	url: '/booking',
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<HomePageHeader />
			{children}
		</>
	)
}
