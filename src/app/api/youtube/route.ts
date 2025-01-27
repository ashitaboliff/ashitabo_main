'use server'

import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { addHours } from 'date-fns'

const prisma = new PrismaClient()

// GETリクエストのハンドラー
export async function POST(req: NextRequest) {
	return NextResponse.json({ message: 'GET request received' }, { status: 200 })
}

// POSTリクエストのハンドラー
export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const code = searchParams.get('code')

	const cookieStore = await cookies()

	if (!code) {
		return NextResponse.json(
			{ error: 'Authorization code is missing' },
			{ status: 400 },
		)
	}

	const oauth2Client = new google.auth.OAuth2(
		process.env.YOUTUBE_CLIENT_ID!,
		process.env.YOUTUBE_CLIENT_SECRET!,
		process.env.YOUTUBE_REDIRECT_URI!,
	)

	try {
		const { tokens } = await oauth2Client.getToken(code as string)
		oauth2Client.setCredentials(tokens)

		// ユーザー情報の取得
		const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' })
		const userInfo = await oauth2.userinfo.get()

		// ユーザー情報とトークンの保存
		await prisma.youtubeAuth.upsert({
			where: { google_id: userInfo.data.id ?? '' },
			update: {
				access_token: tokens.access_token ?? '',
				refresh_token: tokens.refresh_token ?? '',
				token_expiry: tokens.expiry_date
					? new Date(tokens.expiry_date)
					: new Date(),
			},
			create: {
				google_id: userInfo.data.id ?? '',
				email: userInfo.data.email ?? '',
				access_token: tokens.access_token ?? '',
				refresh_token: tokens.refresh_token ?? '',
				token_expiry: tokens.expiry_date
					? new Date(tokens.expiry_date)
					: new Date(),
			},
		})

		revalidateTag('youtube-token')
		cookieStore.set(
			'tokenExpired',
			new Date(addHours(new Date(), 1)).toISOString(),
			{ maxAge: 3600 },
		)

		return NextResponse.redirect(new URL('/admin/youtube', req.url))
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to exchange authorization code for tokens' },
			{ status: 500 },
		)
	}
}
