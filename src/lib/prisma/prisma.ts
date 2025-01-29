import { PrismaClient } from '@prisma/client'

class PrismaSingleton {
	private static instance: PrismaClient

	private constructor() {}

	public static getInstance(): PrismaClient {
		if (!PrismaSingleton.instance) {
			PrismaSingleton.instance = new PrismaClient()
		}
		return PrismaSingleton.instance
	}
}

const prisma = PrismaSingleton.getInstance()

// アプリケーション終了時に接続を切断
process.on('beforeExit', async () => {
	await prisma.$disconnect()
})

export default prisma
