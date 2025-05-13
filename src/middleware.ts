import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/features/auth/lib/authOption' // AuthOption.tsx から auth をインポート

// import authConfig from '@/features/auth/lib/auth.config' // 不要
// import NextAuth from 'next-auth' // 不要
// const { auth } = NextAuth(authConfig) // 不要

export const config = {
	matcher: ['/((?!_next|api|favicon.ico).*)'],
}

class MiddlewareApp {
	private request: NextRequest
	private isMaintenanceMode: boolean = process.env.MAINTENANCE_MODE == 'true'

	constructor(request: NextRequest) {
		this.request = request
	}

	private startWith = (path: string) => {
		return this.request.nextUrl.pathname.startsWith(path)
	}

	private reg = (path: string) => {
		return new RegExp(path, 'g').test(this.request.nextUrl.pathname)
	}

	private contain = (paths: string[]) => {
		// oahts -> paths に変更
		return paths.some((path) => this.request.nextUrl.pathname.includes(path))
	}

	private redirect = (path: string) => {
		return NextResponse.redirect(new URL(path, this.request.url), {
			status: 301, // 永続的なリダイレクトの場合は301、一時的な場合は302または307
		})
	}

	private match = (path: string) => {
		return this.request.nextUrl.pathname === path
	}

	private getIpAddress = () => {
		// getIpAdress -> getIpAddress に変更
		const xff = this.request.headers.get('x-forwarded-for')
		return xff ? (Array.isArray(xff) ? xff[0] : xff.split(',')[0]) : '127.0.0.1'
	}

	private getSimpleIpAddress = () => {
		// getSimpleIpAdress -> getSimpleIpAddress に変更
		// ::ffff: 等のプレフィックスを削除
		// 数字がはじまる位置を探して、それ以降を取得する
		const ip = this.getIpAddress() // 修正されたメソッド名を使用
		const index = ip.search(/[0-9]/)
		return index === -1 ? ip : ip.slice(index) // 数字が見つからない場合の考慮
	}

	public run = async () => {
		// request.auth を利用できるように async を維持
		// request.auth を使用して認証状態やユーザー情報を取得可能
		// const session = this.request.auth; // NextAuthRequest から auth を取得
		// console.log('Middleware session:', session);

		// メンテナンスモードでない時は、/maintenance を404にする
		if (!this.isMaintenanceMode) {
			if (this.contain(['/maintenance'])) {
				this.request.nextUrl.pathname = '/404'
				return NextResponse.rewrite(this.request.nextUrl)
			}
		}

		// メンテナンスモード時の処理
		if (this.isMaintenanceMode) {
			// 繰り返しリダイレクトを防ぐ
			if (this.request.nextUrl.pathname === '/maintenance')
				return NextResponse.next()

			// ホワイトリストの場合はメンテナンス画面を表示しない
			const maintenanceWhiteListIPs =
				process.env.MAINTENANCE_WHITELIST?.split(',') ?? []
			if (!maintenanceWhiteListIPs.includes(this.getSimpleIpAddress())) {
				// メンテナンス画面へリダイレクト
				// AUTH_URL が設定されていることを確認
				const maintenanceUrl = process.env.AUTH_URL
					? `${process.env.AUTH_URL}/maintenance`
					: '/maintenance'
				return NextResponse.rewrite(new URL(maintenanceUrl, this.request.url), {
					status: 503,
				})
			}
		}

		// / でのアクセスは、/home にリダイレクト
		if (this.match('/')) {
			return this.redirect('/home')
		}

		// /auth でのアクセスは、/auth/padlock にリダイレクト
		if (this.match('/auth')) {
			return this.redirect('/auth/padlock')
		}

		// redirectFrom パラメータがある場合の alert はクライアントサイドでのみ実行可能
		// ミドルウェアはサーバーサイドで実行されるため、alert はここでは機能しない
		// if (this.request.nextUrl.searchParams.has('redirectFrom')) {
		// 	console.log(
		// 		`Redirected from: ${this.request.nextUrl.searchParams.get('redirectFrom')}`,
		// 	)
		// }
		return NextResponse.next() // 明示的に NextResponse.next() を返す
	}
}

// NextAuth.js v5 では、auth 関数をミドルウェアとして直接エクスポートすることが推奨される
// export default auth; // これで /api/auth/* 以外の全てのリクエストが保護される

// カスタムロジックを加えたい場合は、auth でラップする
export default auth(async function middleware(request) {
	// request の型は NextAuthRequest となる
	// request.auth にはセッション情報が含まれる (拡張されたもの)
	// console.log('Session in middleware:', request.auth);

	const headers = request.headers
	console.log(
		`ip: ${headers.get('X-Forwarded-For')}, ua: ${headers.get('user-agent')}`,
	)
	const app = new MiddlewareApp(request as NextRequest) // MiddlewareApp が NextRequest を期待する場合キャスト
	return app.run()
})
