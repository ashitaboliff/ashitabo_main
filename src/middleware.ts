import { NextRequest, NextResponse } from 'next/server'
// export { auth as middleware } from '@/lib/auth/AuthOption'
import authConfig from '@/lib/auth/auth.config'
import NextAuth from 'next-auth'
const { auth } = NextAuth(authConfig)

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

class MiddlewareApp {
	private request: NextRequest
	private isMaintenanceMode: boolean = process.env.MAINTENANCE_MODE == 'true'
	private session: any

	constructor({ request, session }: { request: NextRequest; session: any }) {
		this.request = request
		this.session = session
	}

	private startWith = (path: string) => {
		return this.request.nextUrl.pathname.startsWith(path)
	}

	private reg = (path: string) => {
		return new RegExp(path, 'g').test(this.request.nextUrl.pathname)
	}

	private contain = (oahts: string[]) => {
		return oahts.some((path) => this.request.nextUrl.pathname.includes(path))
	}

	private redirect = (path: string) => {
		return NextResponse.redirect(new URL(path, this.request.url), {
			status: 301,
		})
	}

	private getIpAdress = () => {
		const xff = this.request.headers.get('x-forwarded-for')
		return xff ? (Array.isArray(xff) ? xff[0] : xff.split(',')[0]) : '127.0.0.1'
	}

	private getSimpleIpAdress = () => {
		// ::ffff: 等のプレフィックスを削除
		// 数字がはじまる位置を探して、それ以降を取得する
		const ip = this.getIpAdress()
		const index = ip.search(/[0-9]/)
		return ip.slice(index)
	}

	public run = async () => {
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
			if (!maintenanceWhiteListIPs.includes(this.getSimpleIpAdress())) {
				// メンテナンス画面へリダイレクト
				const url = `${process.env.NEXT_PUBLIC_URL}/maintenance`
				return NextResponse.rewrite(new URL(url, this.request.url), {
					status: 503,
				})
			}
		}
	}
}

export default auth(async function middleware(request: NextRequest) {
	const headers = request.headers
	const session = await auth()
	console.log(
		`ip: ${headers.get('X-Forwarded-For')}, ua: ${headers.get('user-agent')}`,
	)
	const app = new MiddlewareApp({ request, session })
	return app.run()
})
