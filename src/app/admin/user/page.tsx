'use server'

import { notFound } from 'next/navigation'
import AdminUserPage from '@/features/admin/components/AdminUserPage'
import {
	getUserRoleAction,
	getAllUserDetailsAction,
} from '@/features/admin/components/action' // Added getAllUserDetailsAction
import { getSession } from '@/app/actions'
import { UserDetail } from '@/features/user/types' // Added UserDetail type

interface AdminUsersPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const Page = async ({ searchParams }: AdminUsersPageProps) => {
	const session = await getSession()
	if (!session?.user?.id) {
		// Check for session.user.id as well
		return notFound()
	}

	const userRole = await getUserRoleAction(session.user.id)
	// Ensure userRole.response is checked correctly against 'USER' (assuming 'user' was a typo)
	if (userRole.response === 'USER' || userRole.status !== 200) {
		return notFound()
	}

	// searchParams.adminUserPage の処理
	const adminUserPageParam = (await searchParams).adminUserPage
	const currentPageString = Array.isArray(adminUserPageParam)
		? adminUserPageParam[0]
		: adminUserPageParam
	const currentPage = parseInt(currentPageString || '1', 10)

	// searchParams.adminUserLimit の処理
	const adminUserLimitParam = (await searchParams).adminUserLimit
	const usersPerPageString = Array.isArray(adminUserLimitParam)
		? adminUserLimitParam[0]
		: adminUserLimitParam
	const usersPerPage = parseInt(usersPerPageString || '10', 10)

	// searchParams.adminUserSort の処理
	const adminUserSortParam = (await searchParams).adminUserSort
	let sort: 'new' | 'old' = 'new' // デフォルト値
	if (
		typeof adminUserSortParam === 'string' &&
		(adminUserSortParam === 'new' || adminUserSortParam === 'old')
	) {
		sort = adminUserSortParam
	} else if (
		Array.isArray(adminUserSortParam) &&
		typeof adminUserSortParam[0] === 'string' &&
		(adminUserSortParam[0] === 'new' || adminUserSortParam[0] === 'old')
	) {
		sort = adminUserSortParam[0]
	}

	let users: UserDetail[] = []
	let totalCount = 0

	const usersRes = await getAllUserDetailsAction({
		sort,
		page: currentPage,
		perPage: usersPerPage,
	})

	if (usersRes.status === 200) {
		users = usersRes.response.users
		totalCount = usersRes.response.totalCount
	} else {
		console.error('Failed to fetch admin users:', usersRes.response)
		// Optionally, handle this error more gracefully in the UI
	}

	const pageMax = Math.ceil(totalCount / usersPerPage) || 1

	return (
		<AdminUserPage
			session={session}
			initialUsers={users}
			initialPageMax={pageMax}
			initialCurrentPage={currentPage}
			initialUsersPerPage={usersPerPage}
			initialSort={sort}
		/>
	)
}

export default Page
