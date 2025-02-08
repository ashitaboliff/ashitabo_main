const { v4 } = require('uuid')

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
			0,
			0,
			0,
			0,
		),
	)
	utcDate.setUTCDate(utcDate.getUTCDate() + addDay)

	return utcDate.toISOString()
}

async function main() {
	console.log('Seeding data...')

	// await prisma.user.createMany({
	// 	data: [
	// 		{
	// 			id: '1',
	// 			role: 'USER',
	// 			name: 'user1',
	// 		},
	// 		{
	// 			id: '2',
	// 			role: 'USER',
	// 			name: 'user2',
	// 		},
	// 		{
	// 			id: '3',
	// 			role: 'USER',
	// 			name: 'user3',
	// 		},
	// 		{
	// 			id: '4',
	// 			role: 'USER',
	// 			name: 'user4',
	// 		},
	// 		{
	// 			id: '5',
	// 			role: 'USER',
	// 			name: 'user5',
	// 		},
	// 		{
	// 			id: '6',
	// 			role: 'USER',
	// 		},
	// 		{
	// 			id: '7',
	// 			role: 'USER',
	// 		},
	// 		{
	// 			id: '8',
	// 			role: 'USER',
	// 		},
	// 		{
	// 			id: '9',
	// 			role: 'USER',
	// 		},
	// 		{
	// 			id: '10',
	// 			role: 'USER',
	// 		},
	// 	],
	// })

	await prisma.user.create({
		data: {
			id: 'admin',
			role: 'ADMIN',
		},
	})

	await prisma.padLock.createMany({
		data: [
			{
				name: 'test',
				password: hashSync('1234', 5),
			},
		],
	})

	await prisma.profile.createMany({
		data: [
			{
				id: v4(),
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
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(1),
				booking_time: 1,
				regist_name: 'サンプルバンド',
				name: 'サンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(2),
				booking_time: 2,
				regist_name:
					'長文バンド名サンプル長文バンド名サンプル長文バンド名サンプル長文バンド名サンプル長文バンド名サンプル長文バンド名サンプル',
				name: '長文ユーザー名サンプル長文ユーザー名サンプル長文ユーザー名サンプル長文ユーザー名サンプル長文ユーザー名サンプル長文ユーザー名サンプル長文ユーザー名サンプル',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(4),
				booking_time: 1,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
		],
	})

	await prisma.exBooking.createMany({
		data: [
			{
				start_date: DateFormat(3),
				start_time: 0,
				end_time: 5,
				description: 'サンプル禁止',
			},
			{
				start_date: DateFormat(5),
				start_time: 0,
				end_time: 5,
				description: 'サンプル禁止',
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
