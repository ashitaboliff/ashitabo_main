'use server'

import { signOut } from '@/lib/auth/AuthOption'

export const signOutUser = async () => {
	await signOut()
}
