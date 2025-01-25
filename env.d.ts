declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: 'development' | 'production'
		POSTGRES_PRISMA_URL: string
		GA_ID: string
		NEXT_PUBLIC_LIFF_ID: string
		AUTH_LINE_SECRET: string
		AUTH_LINE_SECRET: string
		AUTH_URL: string
		NEXTAUTH_SECRET: string
		AUTH_SECRET: string
		ADMIN_ID: string
		ADMIN_PASSWORD: string
		TEST_ID: string
		TEST_PASSWORD: string
		MAINTENANCE_MODE: string
		YOUTUBE_CLIENT_ID: string
		YOUTUBE_CLIENT_SECRET: string
		YOUTUBE_REDIRECT_URI: string
		YOUTUBE_API_KEY: string
	}
}
