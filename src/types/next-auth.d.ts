import NextAuth, { type DefaultSession } from 'next-auth'
import { AdapterUser } from '@auth/core/adapters'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			user_id: string
			name: string
			image: string
			full_name: string
			part: string[]
			role: string
			is_profile: boolean
		} & DefaultSession['user']
	}
	interface User extends AdapterUser {
		id: string
		user_id: string
		name: string
		image: string
		full_name: string
		part: string[]
		role: string
		is_profile: boolean
	}
}

declare module '@auth/core/adapters' {
	interface AdapterUser {
		id: string
		user_id: string
		name: string
		image: string
		full_name: string
		part: string[]
		role: string
		is_profile: boolean
	}
}
