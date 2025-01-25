export interface Video {
	title: string
	link: string
	videoId: string
	playlistId: string
	createdAt?: Date
	updatedAt?: Date
	tags?: string[]
}

export interface Playlist {
	playlistId: string
	title: string
	link: string
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
