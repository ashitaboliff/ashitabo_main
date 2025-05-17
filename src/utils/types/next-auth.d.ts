import NextAuth, { type DefaultSession } from 'next-auth'
// AdapterUser のインポートは削除し、@auth/core/adapters モジュール拡張内で直接定義します。
// import { AdapterUser } from '@auth/core/adapters'
import type { User as PrismaUser } from '@prisma/client' // PrismaのUserモデルをインポート
import type { Profile as UserProfile } from '@/features/user/types' // 既存のProfile型をインポート
import { AccountRole, Part } from '@auth/core/types' // 既存のインポートを維持

declare module 'next-auth' {
	interface Session {
		user: {
			id: string // ユーザーID (DBのUser.idに紐づく想定)
			name?: string | null // DefaultSessionにもあるが、明示的に型付け
			email?: string | null // DefaultSessionにはある。既存の型にはなかったので追加。
			image?: string | null // DefaultSessionにもあるが、明示的に型付け

			// --- 既存のカスタムフィールド (維持) ---
			user_id: string // id との使い分けを確認。dbUser.id と同じなら不要になる可能性。
			full_name: string
			part: Part[]
			role: AccountRole
			is_profile: boolean
			// --- ここまで既存のカスタムフィールド ---

			// ↓ ここから追加するプロパティ
			dbUser?: PrismaUser | null
			dbProfile?: UserProfile | null
			// ↑ ここまで追加するプロパティ
		} & DefaultSession['user']
	}

	// NextAuthのUser型。jwtコールバックのuser引数など。
	// Prisma Adapterを使っている場合、DBのUserモデルのフィールドを持つことが多い。
	interface User {
		// `extends AdapterUser` は削除。AdapterUserは別途 @auth/core/adapters で拡張。
		id: string
		// 既存の定義を維持
		user_id: string
		name: string // (nullableでない点に注意)
		image: string // (nullableでない点に注意)
		email?: string | null // DefaultUserにはある。既存定義に合わせて追加。
		// PrismaのUserモデルの他のフィールドも必要に応じてここに追加
	}
}

declare module '@auth/core/adapters' {
	// Prisma Adapterが使用するUserの型。PrismaのUserモデルと一致させるのが理想。
	interface AdapterUser {
		// --- 既存のカスタムフィールド (維持) ---
		// これらがPrismaのUserモデルに実際に存在するか確認が必要。
		id: string
		user_id: string
		name: string
		image: string
		full_name: string
		part: string[]
		role: string
		is_profile: boolean
		// --- ここまで既存のカスタムフィールド ---

		email?: string | null // PrismaのUserモデルにemailがあれば追加
		emailVerified?: Date | null // PrismaのUserモデルにemailVerifiedがあれば追加
		// PrismaのUserモデルの他のフィールドも必要に応じてここに追加
	}
}
