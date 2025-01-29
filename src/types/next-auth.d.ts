import NextAuth, { type DefaultSession } from 'next-auth'
import { AdapterUser } from '@auth/core/adapters'
import { AccountRole, Part } from '@auth/core/types'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			user_id: string
			name: string
			image: string
			full_name: string
			part: Part[]
			role: AccountRole
			is_profile: boolean
		} & DefaultSession['user']
	}
	interface User extends AdapterUser {
		id: string
		user_id: string
		name: string
		image: string
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
