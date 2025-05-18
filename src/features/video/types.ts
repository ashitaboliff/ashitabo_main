export interface Video {
	title: string
	link: string
	videoId: string
	liveDate: string
	playlistId: string
	createdAt?: Date
	updatedAt?: Date
	tags?: string[]
}

export interface Playlist {
	playlistId: string
	title: string
	link: string
	liveDate: string
	videos: Video[]
	createdAt?: Date
	updatedAt?: Date
	tags?: string[]
}

export interface Token {
	google_id: string
	created_at: Date
	updated_at: Date
	email: string
	access_token: string
	refresh_token: string
	token_expiry: Date
	is_deleted: boolean
}

export type liveOrBand = 'live' | 'band'

export interface YoutubeDetail {
	id: string // playlistId or videoId
	title: string
	link: string
	tags: string[]
	liveDate: string
	playlistId?: string
	videoId?: string
	playlistTitle?: string
	liveOrBand: liveOrBand
}

export interface YoutubeSearchQuery {
	liveOrBand: liveOrBand
	bandName?: string
	liveName?: string
	tag?: string[]
	tagSearchMode?: 'and' | 'or' // タグ検索モードを追加
	sort: 'new' | 'old'
	page: number
	videoPerPage: number
}
