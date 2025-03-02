import { PrismaClient } from '@prisma/client'

class PrismaSingleton {
	private static instance: PrismaClient
	private static serializableInstance: PrismaClient

	private constructor() {}

	public static getInstance(): PrismaClient {
		if (!PrismaSingleton.instance) {
			PrismaSingleton.instance = new PrismaClient()
		}
		return PrismaSingleton.instance
	}

	public static getSerializableInstance(): PrismaClient {
		if (!PrismaSingleton.serializableInstance) {
			PrismaSingleton.serializableInstance = new PrismaClient({
				datasources: {
					db: {
						url: process.env.POSTGRES_PRISMA_URL + '?isolation=serializable',
					},
				},
			})
		}
		return PrismaSingleton.serializableInstance
	}
}

const prisma = PrismaSingleton.getInstance()
export const serializablePrisma = PrismaSingleton.getSerializableInstance()

// アプリケーション終了時に接続を切断
process.on('beforeExit', async () => {
	await prisma.$disconnect()
})

export default prisma
