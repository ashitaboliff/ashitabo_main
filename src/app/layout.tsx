import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import LocalFont from 'next/font/local'
import './globals.css'
import ProgressBarProvider from '@/components/atoms/ProgressBarProvider'
import Header from '@/components/molecules/Header'
import Footer from '@/components/molecules/Footer'
import { GoogleAnalytics } from '@next/third-parties/google'
import { LiffProvider } from '@/lib/liff/LiffOption'
import NextAuthProvider from '@/lib/auth/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

const nicomoji = LocalFont({
	src: '../lib/fonts/nicomoji-plus_v2-5.woff',
	weight: 'normal',
	style: 'normal',
	variable: '--nicomoji',
})

const gkktt = LocalFont({
	src: '../lib/fonts/851Gkktt_005.woff',
	weight: 'normal',
	style: 'normal',
	variable: '--851-gkktt',
})

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
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="google-adsense-account" content="ca-pub-6241533281842243" />
				<link
					rel="preload"
					href="/fonts/nicomoji-plus_v2-5.woff"
					as="font"
					type="font/woff"
					crossOrigin="anonymous"
				/>
				<link rel="icon" href="/favicon.ico" type="image/x-icon" />
				<link
					rel="preload"
					href="/fonts/851Gkktt_005.woff"
					as="font"
					type="font/woff"
					crossOrigin="anonymous"
				/>
			</head>
			<body className={inter.className}>
				<div
					className="flex space-x-4"
					dangerouslySetInnerHTML={{
						__html:
							'<!-- 拙い知識で作ったやつなので、可読性めっちゃ低くて申し訳ないけど頑張ってね！！！ 変態糞学生 -->' +
							'<!-- てことでソースコードはこちらからhttps://github.com/watabegg/k_on_line -->',
					}}
				/>
				<NextAuthProvider>
					<ProgressBarProvider>
						<div className="relative">
							<Header className={nicomoji.className} />
							<LiffProvider liffId={process.env.LIFF_ID ?? ''}>
								{children}
							</LiffProvider>
							<Footer />
						</div>
					</ProgressBarProvider>
				</NextAuthProvider>
			</body>
			<GoogleAnalytics gaId={process.env.GA_ID ?? ''} />
		</html>
	)
}
