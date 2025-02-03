export type GachaData = {
	id: number
	src: string
	title?: string
}

export type GachaCategory = {
	late: number
	name: string
	data: GachaData[]
}

export type GachaListItem = {
	common: GachaCategory
	rare: GachaCategory
	superRare: GachaCategory
	ssRare: GachaCategory
	ultraRare: GachaCategory
	secretRare: GachaCategory
}
