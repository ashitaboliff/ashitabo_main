import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'
import authConfig from '@/features/auth/lib/auth.config'
import type { User as PrismaUser } from '@prisma/client'
import type {
	Profile as UserProfile,
	Part,
	Role as AccountRole,
} from '@/features/user/types'

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
		async jwt({ token, user, trigger, session: updateSessionData }) {
			// 初回サインイン時 (user オブジェクトが存在し、token.dbUser がまだない場合)
			if (user?.id && !token.dbUser) {
				token.sub = user.id;
				const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
				if (dbUser) {
					token.dbUser = dbUser;
					const dbProfile = await prisma.profile.findUnique({ where: { user_id: user.id } });
					token.dbProfile = dbProfile || null;
				}
			}
		
			// セッション更新トリガー時 (useSession().update() が呼ばれた時)
			// この時、token.sub と token.dbUser は既に存在しているはず
			if (trigger === 'update' && token.sub && typeof token.sub === 'string' && token.dbUser) {
				const refreshedDbProfile = await prisma.profile.findUnique({
					where: { user_id: token.sub },
				});
				token.dbProfile = refreshedDbProfile || null;
				
				// dbUserも念のため更新
				const refreshedDbUser = await prisma.user.findUnique({ where: { id: token.sub } });
				if (refreshedDbUser) token.dbUser = refreshedDbUser;
			}
			return token;
		},
		async session({ session, token }) {
			// token.sub, token.dbUser, token.dbProfile を session.user にマッピングする
			if (session.user) {
				if (token.sub && typeof token.sub === 'string') {
					session.user.id = token.sub;
				}

				if (token.dbUser) {
					const dbUserData = token.dbUser as PrismaUser;
					session.user.dbUser = dbUserData;
					session.user.name = dbUserData.name ?? session.user.name;
					session.user.email = dbUserData.email ?? session.user.email;
					session.user.image = dbUserData.image ?? session.user.image;
					session.user.user_id = dbUserData.id;
				}

				// dbProfile の undefined チェックをより明示的に
				if (Object.prototype.hasOwnProperty.call(token, 'dbProfile')) {
					const dbProfileData = token.dbProfile as UserProfile | null;
					session.user.dbProfile = dbProfileData;

					if (dbProfileData) {
						session.user.is_profile = true;
						session.user.full_name = dbProfileData.name ?? '';
						session.user.part = dbProfileData.part as Part[];
						session.user.role = dbProfileData.role as AccountRole;
					} else {
						session.user.is_profile = false;
						session.user.full_name = session.user.dbUser?.name ?? '';
						session.user.part = [];
						session.user.role = 'USER' as AccountRole;
					}
				} else {
                    // token に dbProfile プロパティ自体が存在しない場合 (初回ログイン直後など、まだjwtにセットされていないケースを考慮)
					session.user.is_profile = false;
					session.user.full_name = session.user.dbUser?.name ?? '';
					session.user.part = [];
					session.user.role = 'USER' as AccountRole;
				}
			}
			return session;
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
