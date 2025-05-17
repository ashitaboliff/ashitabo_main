'use client'

import Image from 'next/image'
import { Session } from 'next-auth'
import { Profile, RoleMap } from '@/features/user/types'
import InstIcon from '@/components/ui/atoms/InstIcon'

const ProfileDisplay = ({
	profile,
	session,
}: {
	profile: Profile
	session: Session
}) => {
	return (
		<div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 mb-4 p-6 bg-base-100 rounded-lg shadow-md">
			<Image
				src={session.user.image ?? '/default-icon.png'} // Fallback for missing image
				alt="ユーザーアイコン"
				width={150}
				height={150}
				className="rounded-full object-cover w-24 h-24 md:w-36 md:h-36"
			/>
			<div className="flex flex-col items-center md:items-start justify-center">
				<div className="text-2xl md:text-4xl font-bold">
					{session.user.name}
				</div>
				<div className="text-sm md:text-base">{RoleMap[profile.role]}</div>
				<InstIcon part={profile.part} size={30} />
			</div>
		</div>
	)
}

export default ProfileDisplay
