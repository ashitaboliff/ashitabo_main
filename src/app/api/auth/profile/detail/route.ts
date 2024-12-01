import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma'

export async function GET(req: NextRequest) {
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
		const profile = await prisma.profile.findFirst({
			where: {
				id: user_id,
			},
		})
		if (!profile) {
			return NextResponse.json(
				{ error: 'このユーザはプロフィールが設定されていません' },
				{ status: 404 },
			)
		}
		return NextResponse.json({ response: profile }, { status: 200 })
	} catch (error) {
		return NextResponse.json(
			{ error: 'プロフィールの取得に失敗しました' },
			{ status: 500 },
		)
	}
}
