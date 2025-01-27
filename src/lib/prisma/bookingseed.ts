// const { v4 } = require('uuid')

// const { hashSync } = require('bcryptjs')
// const { PrismaClient } = require('@prisma/client')

// const prisma = new PrismaClient()

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

async function booking() {
	console.log('Seeding data...')

	await prisma.booking.createMany({
		data: [
			{
				booking_date: DateFormat(5),
				booking_time: 2,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(7),
				booking_time: 0,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(7),
				booking_time: 1,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(7),
				booking_time: 2,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(7),
				booking_time: 3,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(7),
				booking_time: 4,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(7),
				booking_time: 5,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(7),
				booking_time: 6,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(7),
				booking_time: 7,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(8),
				booking_time: 0,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(8),
				booking_time: 1,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(8),
				booking_time: 2,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(8),
				booking_time: 3,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(8),
				booking_time: 4,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(8),
				booking_time: 5,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(8),
				booking_time: 6,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(8),
				booking_time: 7,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(9),
				booking_time: 0,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(9),
				booking_time: 1,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(9),
				booking_time: 2,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(9),
				booking_time: 3,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(9),
				booking_time: 4,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(9),
				booking_time: 5,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(9),
				booking_time: 6,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(9),
				booking_time: 7,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(10),
				booking_time: 0,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(10),
				booking_time: 1,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(10),
				booking_time: 2,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(10),
				booking_time: 3,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(10),
				booking_time: 4,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(10),
				booking_time: 5,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(10),
				booking_time: 6,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
			{
				booking_date: DateFormat(10),
				booking_time: 7,
				regist_name: 'わたべサンプルバンド',
				name: 'わたべサンプルユーザー',
				user_id: 'admin',
				password: hashSync('1234', 10),
			},
		],
	})

	console.log('Data seeding complete.')
}

booking()
	.catch((err) => {
		console.error('Error seeding data:', err)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
