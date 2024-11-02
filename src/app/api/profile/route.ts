'use sever'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma'

export async function POST(request: NextRequest) {
	const body = await request.json()
	const { user_id, password } = body

	const user = await prisma.user.findFirst({
		where: {
			user_id,
		},
	})

	if (!user) {
		return NextResponse.json(
			{ error: 'ユーザーが見つかりません' },
			{ status: 401 },
		)
	}

	if (user.password !== password) {
		return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 })
	}

	return NextResponse.json({ response: 'success' }, { status: 200 })
}
