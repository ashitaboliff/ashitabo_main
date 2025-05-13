'use server'

import { signOut } from '@/features/auth/lib/authOption'

export const signOutUser = async () => {
	await signOut()
}
