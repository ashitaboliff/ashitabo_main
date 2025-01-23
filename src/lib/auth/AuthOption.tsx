import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import authConfig from '@/lib/auth/auth.config'
import { compare } from 'bcryptjs'

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	debug: false,
	session: {
		strategy: 'jwt',
		maxAge: 6 * 30 * 24 * 60 * 60, // 6 months
	},
	secret: process.env.AUTH_SECRET,
	...authConfig,
	pages: {
		signIn: '/auth/signin/setting',
		signOut: '/home',
	},
	trustHost: true,
	callbacks: {
		async session({ session, token, user }) {
			// token なんも入ってないなんこいつ
			return {
				...session,
				...token,
				user: {
					...session.user,
					...user,
					id: token.sub,
				},
			}
		},
	},
	cookies: {
		state: {
			name: 'next-auth.state',
			options: {
				httpOnly: true,
				sameSite: 'lax', // "strict" にすると CSRF 保護が強化されるが問題が起こる場合もあり
				path: '/',
				secure: process.env.NODE_ENV === 'production',
			},
		},
	},
})
