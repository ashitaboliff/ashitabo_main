export type Role = 'GRADUATE' | 'STUDENT'

type RoleEnum = '卒業生' | '現役生'

export type Part =
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

type AccountRole = 'ADMIN' | 'USER'

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
	user_id: string
	name?: string | null
	student_id?: string | null
	expected?: string | null
	created_at?: Date
	updated_at?: Date
	role: Role
	part: Part[]
	is_deleted?: boolean
}

export interface User {
	id: string
	user_id: string | null
	name: string | null
	role: AccountRole | null
	password: string | null
	email: string | null
	emailVerified: Date | null
	image: string | null
	createdAt: Date
	updatedAt: Date
}

/**
 * const profile: {
    name: string | null;
    id: string;
    user_id: string;
    role: $Enums.Role;
    student_id: string | null;
    created_at: Date;
    updated_at: Date;
    expected: string | null;
    part: $Enums.Part[];
    is_deleted: boolean;
} | null
 */
