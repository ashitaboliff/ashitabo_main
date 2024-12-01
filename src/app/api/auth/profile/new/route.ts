import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma'

export async function POST(req: NextRequest) {
	const body = await req.json()
	const params = req.nextUrl.searchParams
	const user_id = params.get('userId')

	if (!user_id) {
		return NextResponse.json(
			{ error: '必要な引数が設定されていません:userId' },
			{ status: 400 },
		)
	}

	try {
		const isUserExist = await prisma.user.findFirst({
			where: {
				id: user_id,
			},
		})
		if (!isUserExist) {
			return NextResponse.json(
				{ error: 'このidのユーザは存在しません' },
				{ status: 404 },
			)
		}
		await prisma.profile.create({
			data: {
				id: user_id,
				name: body.name,
				student_id: body.student_id,
				expected: body.expected,
				role: body.role,
				part: body.part,
			},
		})
		return NextResponse.json({ status: 200 })
	} catch (error) {
		return NextResponse.json(
			{ error: 'プロフィールの設定に失敗しました' },
			{ status: 500 },
		)
	}
}
