import { Inter } from 'next/font/google'
import { createMetaData } from '@/utils/metaData'
import HomePageHeader from '@/components/home/HomePageHeader'

const inter = Inter({ subsets: ['latin'] })

export const metadata = createMetaData({
	title: '日程調整',
	description: 'バンド内での日程調整ページです',
	url: '/schedule',
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
