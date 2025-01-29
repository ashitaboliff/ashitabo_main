import type { Metadata } from 'next'
import HomePageHeader from '@/components/home/HomePageHeader'

export const metadata: Metadata = {
	title: 'あしたぼホームページ',
	description: '信州大学工学部、軽音サークルのあしたぼ、公式ホームページです。',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="flex flex-col">
			<HomePageHeader />
			{children}
		</div>
	)
}
;<HomePageHeader />
