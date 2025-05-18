import { createMetaData } from '@/utils/metaData'

export async function metadata() {
	return createMetaData({
		title: '管理者ページ',
		description: '管理者ページ',
		url: '/admin',
	})
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <>{children}</>
}
