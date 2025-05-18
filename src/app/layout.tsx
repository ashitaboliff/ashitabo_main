import { Inter } from 'next/font/google'
import LocalFont from 'next/font/local'
import './globals.css'
import ProgressBarProvider from '@/components/ui/atoms/ProgressBarProvider'
import Header from '@/components/ui/molecules/Header'
import Footer from '@/components/ui/molecules/Footer'
import { GoogleAnalytics } from '@next/third-parties/google'
import { LiffProvider } from '@/lib/liff/LiffOption'
import NextAuthProvider from '@/features/auth/lib/AuthProvider'
import { createMetaData } from '@/utils/metaData'

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

export const metadata = createMetaData({
	title: 'あしたぼホームページ',
	url: '/',
})

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
				<script
					dangerouslySetInnerHTML={{
						__html: `
						console.log('%c拙い知識で作ったやつなので、可読性めっちゃ低くて申し訳ないけど頑張ってね！！！ watabegg', 'color: #000000; font-size: 20px; padding: 10px; font-weight: bold;');
						console.log('%cRespect for 変態糞学生', 'color: #ff0000; font-size: 20px; padding: 5px; font-weight: bold; font-style: italic;');
						console.log('%chttps://www.github.com/ashitaboliff/', 'color: #000000; font-size: 14px; padding: 5px; text-decoration: underline;');
					`,
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
