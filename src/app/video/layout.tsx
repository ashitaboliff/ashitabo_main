import type { Metadata } from 'next'
import HomePageHeader from '@/components/home/HomePageHeader'

export const metadata: Metadata = {
	title: 'ライブ動画',
	description: '過去のライブ動画はこちらから、映像の検索も可能です。',
}

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
