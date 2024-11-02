export type Role = 'GRADUATE' | 'STUDENT'

type RoleEnum = '卒業生' | '現役生'

type Part =
	| 'BACKING_GUITER'
	| 'LEAD_GUITER'
	| 'BASS'
	| 'DRUMS'
	| 'KEYBOARD'
	| 'VOCAL'
	| 'OTHER'

type PartEnum =
	| 'バッキングギター'
	| 'リードギター'
	| 'ベース'
	| 'ドラム'
	| 'キーボード'
	| 'ボーカル'
	| 'その他'

export const RoleMap: Record<Role, RoleEnum> = {
	GRADUATE: '卒業生',
	STUDENT: '現役生',
}

export const PartMap: Record<Part, PartEnum> = {
	BACKING_GUITER: 'バッキングギター',
	LEAD_GUITER: 'リードギター',
	BASS: 'ベース',
	DRUMS: 'ドラム',
	KEYBOARD: 'キーボード',
	VOCAL: 'ボーカル',
	OTHER: 'その他',
}

export interface Profile {
	id: string
	name: string
	student_id: string
	expected: string
	role: Role
	part: Part
}
