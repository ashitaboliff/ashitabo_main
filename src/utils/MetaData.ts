const baseUrl = process.env.AUTH_URL || 'https://www.ashitabo.net'

export const createMetaData = ({
	title,
	url,
	image = '/meta/logo.png',
	description = '信州大学工学部軽音サークルあしたぼの公式ホームページです',
	keywords = ['信州大学', '工学部', 'ホームページ', 'サイト', 'あしたぼ', '軽音', 'バンド', 'サークル', '長野県立大学', 'どんぐり', '信大', 'コマ表'],
}: {
	title: string
	url: string
	description?: string
	image?: string
	keywords?: string[]
}) => {
	title = `${title} | あしたぼホームページ`
	url = `${baseUrl}${url}`
	return {
		title,
		metadataBase: new URL(baseUrl),
		generator: 'Next.js',
		description,
		keywords,
		openGraph: {
			title,
			description,
			url,
			siteName: 'あしたぼホームページ',
			images: [{ url: image }],
			locale: 'ja_JP',
			type: 'website',
		},
		icons: {
			icon: '/meta/logo.png',
			apple: '/meta/logo.png',
		},
		twitter: {
			card: 'summary_large_image',
			site: '@ashitabo_dongri',
			title,
			description,
			images: [{ url: image }],
		}
	}
}
