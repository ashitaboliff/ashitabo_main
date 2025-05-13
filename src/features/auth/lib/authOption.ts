import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma' // 共有Prismaクライアントを使用
import authConfig from '@/features/auth/lib/auth.config'
import type { User as PrismaUser } from '@prisma/client'
import type {
	Profile as UserProfile,
	Part,
	Role as AccountRole,
} from '@/features/user/types' // UserProfileからPartとRoleをインポート

// const prisma = new PrismaClient() // ローカルのPrismaClientインスタンスは削除

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma), // 共有インスタンスを使用
	debug: false,
	session: {
		strategy: 'jwt',
		maxAge: 6 * 30 * 24 * 60 * 60, // 6 months
	},
	secret: process.env.AUTH_SECRET,
	...authConfig,
	pages: {
		signOut: '/home',
	},
	trustHost: true,
	callbacks: {
		async jwt({ token, user }) {
			// 初回サインイン時（userオブジェクトが存在する場合）にDBから情報を取得しトークンに格納
			if (user?.id && !token.dbUser) {
				// dbUserがまだトークンにない場合のみDBアクセス
				token.sub = user.id // token.subにDBのUser IDを確実に設定
				const dbUser = await prisma.user.findUnique({
					where: { id: user.id },
				})
				if (dbUser) {
					token.dbUser = dbUser
					// Profile情報を取得。Profileはuser_idで紐づいていると想定
					const dbProfile = await prisma.profile.findUnique({
						where: { user_id: user.id }, // Profileスキーマのuser_idフィールドを参照
					})
					token.dbProfile = dbProfile || null // Profileが存在しない場合はnull
				}
			}
			return token
		},
		async session({ session, token }) {
			if (session.user) {
				if (token.sub) {
					session.user.id = token.sub // セッションのユーザーIDを設定 (DBのUser.id)
				}

				if (token.dbUser) {
					const dbUserData = token.dbUser as PrismaUser
					session.user.dbUser = dbUserData

					// next-auth.d.tsで定義された標準的なフィールドをdbUserから設定
					session.user.name = dbUserData.name ?? session.user.name
					session.user.email = dbUserData.email ?? session.user.email
					session.user.image = dbUserData.image ?? session.user.image

					// next-auth.d.tsで定義されたカスタムフィールドを設定
					session.user.user_id = dbUserData.id // user_idもDBのUser.idと仮定
				}

				if (token.dbProfile !== undefined) {
					const dbProfileData = token.dbProfile as UserProfile | null
					session.user.dbProfile = dbProfileData

					if (dbProfileData) {
						session.user.is_profile = true
						// next-auth.d.tsで定義されたカスタムフィールドをdbProfileから設定
						session.user.full_name = dbProfileData.name ?? '' // UserProfile.nameがnull/undefinedの場合、空文字にフォールバック
						// UserProfileのpartとroleの型がPart[]とAccountRoleにキャスト可能であると仮定
						session.user.part = dbProfileData.part as Part[]
						session.user.role = dbProfileData.role as AccountRole
					} else {
						// dbProfileData が null (つまりプロファイルが存在しない) 場合
						session.user.is_profile = false
						// プロファイルが存在しない場合、関連フィールドを初期化またはデフォルト値に設定
						session.user.full_name = session.user.dbUser?.name ?? '' // Userのnameをフォールバックとして使用
						session.user.part = [] // partは空配列
						// session.user.role = undefined; // roleは未設定 (型定義でオプショナルにするか、デフォルト値を設定)
						// もしデフォルトロールを設定するなら:
						// session.user.role = 'USER' as AccountRole;
					}
				} else {
					// token.dbProfile が undefined (jwtでProfile情報を取得できなかった場合など)
					session.user.is_profile = false
					session.user.full_name = session.user.dbUser?.name ?? ''
					session.user.part = []
					// session.user.role = undefined; // またはデフォルト値
				}
			}
			return session
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
