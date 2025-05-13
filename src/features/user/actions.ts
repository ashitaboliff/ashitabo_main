'use server'

import { signOut } from '@/features/auth/lib/AuthOption'

export const signOutUser = async () => {
	await signOut()
}
