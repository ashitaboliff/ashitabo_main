import NextAuth from 'next-auth'

declare module 'next-auth' {
	interface Session {
		id: string
		user_id: string
		name: string
		image: string
		full_name: string
		part: string[]
		role: string
		is_profile: boolean
	}
	interface User {
		user_id: string?
	}
}
