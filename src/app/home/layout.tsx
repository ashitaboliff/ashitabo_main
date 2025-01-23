import type { Metadata } from 'next'

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
	return <>{children}</>
}
