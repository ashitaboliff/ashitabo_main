'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { getUserAction } from '@/features/auth/components/actions'
import { User } from '@/types/UserTypes'

import { LuMenu } from 'react-icons/lu'
import { FaRegUserCircle } from 'react-icons/fa'
import { RxCountdownTimer } from 'react-icons/rx'
import { MdOutlineEditCalendar } from 'react-icons/md'
import { IoHomeOutline } from 'react-icons/io5'

const Layout = ({ className }: { className: string }) => {
	const session = useSession()
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [user, setUser] = useState<User | undefined>(undefined)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		const main = async () => {
			setLoading(true)
			if (!session.data?.user.id) {
				return
			}
			const user = await getUserAction(session.data?.user.id)
			if (user.status === 200) {
				setUser(user.response as User)
			} else {
				setUser(undefined)
			}
			setLoading(false)
		}
		main()
	}, [session])

	const handleMenuOpen = () => {
		setIsOpen(true)
	}

	const handleMenuClose = () => {
		setIsOpen(false)
	}

	return (
		<div>
			<div
				className={`navbar bg-bg-white mb-5 border-b-2 border-border-light ${className}`}
			>
				<div className="navbar-start">
					<button
						className="btn btn-square btn-ghost text-2xl"
						onClick={handleMenuOpen}
					>
						<LuMenu />
					</button>
				</div>
				<div className="navbar-center">
					<Link href="/home">
						<p className="font-nicoMoji text-3xl text-center">
							あしたぼホームページ
						</p>
					</Link>
				</div>
				<div className="navbar-end">
					<button className="btn btn-square btn-ghost text-3xl">
						<Link href="/user">
							{user ? (
								loading ? (
									<div className="skeleton w-10 h-10"></div>
								) : (
									<Image
										src={user.image as string}
										alt="user icon"
										width={40}
										height={40}
										className="rounded-full"
									/>
								)
							) : (
								<FaRegUserCircle />
							)}
						</Link>
					</button>
				</div>
			</div>

			<input
				type="checkbox"
				id="menu-drawer"
				className="drawer-toggle"
				checked={isOpen}
				readOnly
			/>
			<div className="drawer-side border-r-2 border-border-light z-50">
				<label
					htmlFor="menu-drawer"
					className="drawer-overlay"
					onClick={handleMenuClose}
				></label>
				<ul className="menu p-4 w-5/12 bg-bg-light text-text-light h-full">
					<li className="menu-title text-lg">
						<span>メニュー</span>
					</li>
					<li onClick={handleMenuClose} className="text-lg">
						<Link href="/home">
							<IoHomeOutline />
							ホーム
						</Link>
					</li>
					<li onClick={handleMenuClose} className="text-lg">
						<Link href="/booking">
							<MdOutlineEditCalendar /> コマ表
						</Link>
					</li>
					<li onClick={handleMenuClose} className="text-lg">
						<Link href="/booking/logs">
							<RxCountdownTimer /> 予約ログ
						</Link>
					</li>
					<li onClick={handleMenuClose} className="text-lg">
						<Link href="/auth/signin">
							<FaRegUserCircle /> 利用登録
						</Link>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default Layout
