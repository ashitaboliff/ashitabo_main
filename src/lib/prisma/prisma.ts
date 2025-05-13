import { PrismaClient } from '@prisma/client'

// グローバルスコープに型を宣言
declare global {
	// eslint-disable-next-line no-var
	var prismaInstance: PrismaClient | undefined
	// eslint-disable-next-line no-var
	var serializablePrismaInstance: PrismaClient | undefined
}

// 通常のPrisma Clientインスタンス
const prisma =
	global.prismaInstance ||
	new PrismaClient({
		// log: ['query'], // 必要に応じてログ設定
	})
if (process.env.NODE_ENV !== 'production') {
	global.prismaInstance = prisma
}

// シリアライズ可能なトランザクション分離レベル用のPrisma Clientインスタンス
const serializablePrisma =
	global.serializablePrismaInstance ||
	new PrismaClient({
		datasources: {
			db: {
				url: process.env.POSTGRES_PRISMA_URL + '?isolation=serializable',
			},
		},
	})
if (process.env.NODE_ENV !== 'production') {
	global.serializablePrismaInstance = serializablePrisma
}

export default prisma
export { serializablePrisma }
