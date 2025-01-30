import type { NextAuthConfig } from 'next-auth'
import Line from 'next-auth/providers/line'

export default {
	providers: [
		Line({
			checks: [],
		}),
	],
} satisfies NextAuthConfig
