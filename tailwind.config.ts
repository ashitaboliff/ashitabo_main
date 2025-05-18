import type { Config } from 'tailwindcss'

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
		},
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
