import type { Config } from 'tailwindcss'
import themes from 'daisyui/src/theming/themes'

const colorPalette = {
	primary: {
		// 緑系統,successとプライマリ
		light: '#66A54D',
		main: '#2E7D32',
		dark: '#1E5821',
	},
	seconday: {
		// 赤系統,errorとセカンダリ
		light: '#E3646B',
		main: '#DD2E44',
		dark: '#A22130',
	},
	tetiary: {
		// 黄色系統,warningとテルティアリ
		light: '#F0CB51',
		main: '#E6B422',
		dark: '#B39019',
	},
	bg: {
		white: '#FFFFFF',
		light: '#F9F9F9', // デフォルトの背景色
		dark: '#232323', // ダークモード時の背景色
	},
	text: {
		light: '#232323', // デフォルトのテキスト色
		dark: '#F9F9F9', // ダークモード時のテキスト色
	},
	border: {
		light: '#DDDDDD', // デフォルトのボーダー色
		dark: '#F8F8F8', // ダークモード時のボーダー色
	},
	accent: {
		bg: '#D9D9D9',
		blue: '#3C87E0', // リンク色とinfo
		purple: '#9B59B6',
		glay: '#E6E6E6',
	},
	other: {
		google: '#2180FC',
		outlook: '#0072C6',
		yahoo: '#720E9E',
		ios: '#000000',
	},
}

const daisyLight = {
	...themes['light'],
	primary: colorPalette['primary']['main'],
	'primary-content': colorPalette['text']['dark'],
	secondary: colorPalette['seconday']['main'],
	'secondary-content': colorPalette['text']['light'],
	tetiary: colorPalette['tetiary']['main'],
	'tetiary-content': colorPalette['text']['light'],
	accent: colorPalette['accent']['blue'],
	'accent-content': colorPalette['text']['light'],
	neutral: colorPalette['bg']['light'],
	'neutral-content': colorPalette['text']['light'],
	'base-100': colorPalette['bg']['light'],
	'base-200': colorPalette['border']['light'],
	'base-300': colorPalette['accent']['bg'],
	'base-400': colorPalette['accent']['glay'],
	'base-content': colorPalette['text']['light'],
	'primary-light': colorPalette['primary']['light'],
	'primary-dark': colorPalette['primary']['dark'],
	'secondary-light': colorPalette['seconday']['light'],
	'secondary-dark': colorPalette['seconday']['dark'],
	'tetiary-light': colorPalette['tetiary']['light'],
	'tetiary-dark': colorPalette['tetiary']['dark'],
	info: colorPalette['accent']['blue'],
	'info-content': colorPalette['text']['light'],
	success: colorPalette['primary']['main'],
	'success-content': colorPalette['text']['light'],
	warning: colorPalette['tetiary']['main'],
	'warning-content': colorPalette['text']['light'],
	error: colorPalette['seconday']['main'],
	'error-content': colorPalette['text']['light'],
}

const daisyDark = {
	...themes['dark'],
	primary: colorPalette['primary']['main'],
	'primary-content': colorPalette['text']['light'],
	secondary: colorPalette['seconday']['main'],
	'secondary-content': colorPalette['text']['light'],
	accent: colorPalette['accent']['blue'],
	'accent-content': colorPalette['text']['light'],
	neutral: colorPalette['bg']['light'],
	'neutral-content': colorPalette['text']['dark'],
	'base-100': colorPalette['bg']['light'],
	'base-200': colorPalette['border']['dark'],
	'base-300': colorPalette['accent']['bg'],
	'base-content': colorPalette['text']['dark'],
	info: colorPalette['accent']['blue'],
	'info-content': colorPalette['text']['light'],
	success: colorPalette['primary']['main'],
	'success-content': colorPalette['text']['light'],
	warning: colorPalette['tetiary']['main'],
	'warning-content': colorPalette['text']['light'],
	error: colorPalette['seconday']['main'],
	'error-content': colorPalette['text']['light'],
}

const screens = {
	sm: '620px',
	md: '768px',
	lg: '900px',
	xl: '1280px',
	'2xl': '1536px',
}

const config: Config = {
	content: ['./src/**/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			fontFamily: {
				nicoMoji: ['var(--nicomoji)', 'sans-serif'],
				notojp: ['var(--font-noto-jp)', 'sans-serif'],
				gkktt: ['var(--851-Gkktt)', 'sans-serif'],
			},
			fontSize: {
				xxxs: ['0.375rem', { lineHeight: 'normal' }], // 6px
				xxs: ['0.563rem', { lineHeight: '1rem' }], // 9px
				xs: ['0.625rem', { lineHeight: '1rem' }], // 10px
				sm: ['0.875rem', { lineHeight: '1.25rem' }],
				base: ['1rem', { lineHeight: '1.5rem' }],
				lg: ['1.125rem', { lineHeight: '1.75rem' }],
				xl: ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }],
			},
		},
		colors: {
			...colorPalette,
			...daisyLight,
			'bg-white': colorPalette['bg']['white'],
			white: colorPalette['bg']['white'],
		},
		screens,
		maxWidth: {
			'1/4': '25%',
			'1/2': '50%',
			'3/4': '75%',
			'4/5': '80%',
			'9/10': '90%',
			'1/1': '100%',
			'1/2-screen': '50vw',
			'3/4-screen': '75vw',
			'4/5-screen': '80vw',
			sm: '640px',
			md: '768px',
			lg: '900px',
			xl: '1280px',
		},
	},
	darkMode: 'class',
	plugins: [require('daisyui')],
	daisyui: {
		styled: true,

		themes: [
			{
				light: {
					...themes['light'],
					...daisyLight,
				},
				// dark: {
				// 	...themes['dark'],
				// 	...daisyDark,
				// },
			},
		],
	},
	async headers() {
		return [
			{
				source: '/fonts/(.*)',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
		]
	},
}

export default config
