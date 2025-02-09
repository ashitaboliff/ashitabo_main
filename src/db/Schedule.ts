'use server'

import 'server-only'
import prisma from '@/lib/prisma/prisma'
import { v4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import { unstable_cache } from 'next/cache'

export const getUserWithName = async () => {
	async function getUserWithName() {
		try {
			const users = await prisma.user.findMany()
			return users
		} catch (error) {
			throw error
		}
	}
	const users = unstable_cache(getUserWithName, [], {
		tags: ['users'],
	})
	const result = await users()
	return result
}
