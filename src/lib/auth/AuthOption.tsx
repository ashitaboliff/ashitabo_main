import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import authConfig from '@/lib/auth/auth.config'
import { compare } from 'bcryptjs'

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	debug: true,
	session: { strategy: 'jwt' },
	secret: process.env.AUTH_SECRET,
	...authConfig,
	pages: {
		signIn: '/auth/login',
		newUser: '/auth/signin',
	},
	callbacks: {
		async session({ session, token, user }) {
			return {
				...session,
				...token,
				user: {
					...session.user,
					...user,
				},
			}
		},
	},
})
