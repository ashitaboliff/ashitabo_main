// ステータスコードの列挙型
export enum StatusCode {
	// 成功系
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,

	// クライアントエラー系
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	CONFLICT = 409,

	// サーバーエラー系
	INTERNAL_SERVER_ERROR = 500,
	BAD_GATEWAY = 502,
	SERVICE_UNAVAILABLE = 503,
}

// 統一的な API レスポンス型
export type ApiResponse<T> =
	| { status: StatusCode.OK | StatusCode.CREATED; response: T } // 成功レスポンス
	| { status: StatusCode.NO_CONTENT; response?: null } // データなしの成功レスポンス
	| {
			status:
				| StatusCode.BAD_REQUEST
				| StatusCode.UNAUTHORIZED
				| StatusCode.FORBIDDEN
				| StatusCode.NOT_FOUND
				| StatusCode.CONFLICT
			response: string
	  } // クライアントエラー
	| {
			status:
				| StatusCode.INTERNAL_SERVER_ERROR
				| StatusCode.BAD_GATEWAY
				| StatusCode.SERVICE_UNAVAILABLE
			response: string
			error?: string
	  } // サーバーエラー

export type ErrorType = {
	status: number
	response?: string | null
}
