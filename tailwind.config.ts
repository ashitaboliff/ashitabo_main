import type { Config } from 'tailwindcss'

// colorPalette, daisyLight, daisyDark は globals.css で CSS 変数として定義するため削除

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
			// fontSize: {
			// 	xxxs: ['0.375rem', { lineHeight: 'normal' }], // 6px
			// 	xxs: ['0.563rem', { lineHeight: '1rem' }], // 9px
			// 	xs: ['0.625rem', { lineHeight: '1rem' }], // 10px
			// 	sm: ['0.875rem', { lineHeight: '1.25rem' }],
			// 	base: ['1rem', { lineHeight: '1.5rem' }],
			// 	lg: ['1.125rem', { lineHeight: '1.75rem' }],
			// 	xl: ['1.25rem', { lineHeight: '1.75rem' }],
			// 	'2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
			// 	'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
			// 	'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
			// 	'5xl': ['3rem', { lineHeight: '1' }],
			// 	'6xl': ['3.75rem', { lineHeight: '1' }],
			// 	'7xl': ['4.5rem', { lineHeight: '1' }],
			// 	'8xl': ['6rem', { lineHeight: '1' }],
			// 	'9xl': ['8rem', { lineHeight: '1' }],
			// },
		},
		// colors は globals.css で CSS 変数として定義するため削除
		// screens: screens, // screens は globals.css の @theme に一本化するためコメントアウト
		maxWidth: {
			// maxWidth も theme 直下に配置
			'1/4': '25%',
			'1/2': '50%',
			'3/4': '75%',
			'4/5': '80%',
			'9/10': '90%',
			'1/1': '100%',
			'1/2-screen': '50vw',
			'3/4-screen': '75vw',
			'4/5-screen': '80vw',
			sm: '640px', // screens と重複するが、maxWidthとしての定義も残す
			md: '768px',
			lg: '900px',
			xl: '1280px',
		},
	},
	darkMode: 'class',
}

export default config
