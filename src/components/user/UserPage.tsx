'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { Profile, RoleMap } from '@/types/UserTypes'

import InstIcon from '@/components/atoms/InstIcon'

const UserPage = ({
	profile,
	session,
}: {
	profile: Profile
	session: Session
}) => {
	const router = useRouter()

	return (
		<div className="flex flex-col justify-center">
			<div className="flex flex-row justify-around">
				<Image
					src={session.user.image}
					alt="ユーザーアイコン"
					width={150}
					height={150}
					className="rounded-full"
				/>
				<div className="flex flex-col items-center justify-center">
					<div className="text-4xl font-bold">{session.user.name}</div>
					<div className="text-base">{RoleMap[profile.role]}</div>
					<InstIcon part={profile.part} size={30} />
				</div>
			</div>
			<div className="flex flex-row justify-around mt-5">
				<div
					className="btn btn-success btn-outline"
					onClick={() => router.push('/user/edit')}
				>
					プロフィールを編集
				</div>
				<div className="btn btn-error" onClick={async () => await signOut()}>
					ログアウト
				</div>
			</div>
			<div className="mt-5 text-2xl text-center">---以下開発中---</div>
			<div className="flex flex-row justify-around">
				<div className="btn btn-error">アカウントを削除</div>
			</div>
		</div>
	)
}

export default UserPage
