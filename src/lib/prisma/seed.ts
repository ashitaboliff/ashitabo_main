const { hashSync } = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// @ts-ignore
function DateFormat(addDay) {
	let date = new Date()
	let utcDate = new Date(
		Date.UTC(
			date.getUTCFullYear(),
			date.getUTCMonth(),
			date.getUTCDate(),
			15,
			0,
			0,
		),
	)
	utcDate.setUTCDate(utcDate.getUTCDate() + addDay)

	return utcDate
}

async function main() {
	console.log('Seeding data...')

	// ユーザーを作成する例
	// await prisma.user.create({
	// 	data:
	// 		{
	// 			user_id: 'admin',
	// 		}
	// })

	await prisma.padLock.createMany({
		data: [
			{
				name: 'test',
				password: hashSync('1234', 5),
			},
		],
	})

	const admin = await prisma.user.findFirst({
		where: {
			user_id: 'admin',
		},
	})

	await prisma.profile.createMany({
		data: [
			{
				id: admin.id,
				user_id: 'admin',
				role: 'STUDENT',
				part: ['BASS'],
			},
		],
	})

	await prisma.booking.createMany({
		data: [
			{
				booking_date: DateFormat(0),
				booking_time: 0,
				regist_name: 'サンプルバンド',
				name: 'サンプルユーザー',
				user_id: admin.id,
				password: hashSync('pass', 5),
			},
			{
				booking_date: DateFormat(1),
				booking_time: 1,
				regist_name: 'サンプルバンド',
				name: 'サンプルユーザー',
				user_id: admin.id,
				password: hashSync('pass', 5),
			},
			{
				booking_date: DateFormat(2),
				booking_time: 2,
				regist_name:
					'長文バンド名サンプル長文バンド名サンプル長文バンド名サンプル長文バンド名サンプル長文バンド名サンプル長文バンド名サンプル',
				name: '長文ユーザー名サンプル長文ユーザー名サンプル長文ユーザー名サンプル長文ユーザー名サンプル長文ユーザー名サンプル長文ユーザー名サンプル長文ユーザー名サンプル',
				user_id: admin.id,
				password: hashSync('pass', 5),
			},
			{
				booking_date: DateFormat(4),
				booking_time: 1,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: admin.id,
				password: hashSync('pass', 5),
			},
		],
	})
	console.log('Data seeding complete.')
}

main()
	.catch((err) => {
		console.error('Error seeding data:', err)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
