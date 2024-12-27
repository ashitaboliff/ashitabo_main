'use client'

import Link from 'next/link'

import { LuLockKeyhole } from 'react-icons/lu'
import { FaRegUserCircle } from 'react-icons/fa'
import { RiAdminLine } from 'react-icons/ri'
import { MdOutlineEditCalendar } from 'react-icons/md'
import { RxCrossCircled } from 'react-icons/rx'

const AdminMain = () => {
	return (
		<div className="flex flex-col items-center justify-center p-4">
			<div className="text-2xl font-bold">三役用管理ページ</div>
			<div className="overflow-x-auto">
				<table className="table">
					<tbody>
						<tr>
							<th>
								<FaRegUserCircle />
							</th>
							<td>
								<Link href="/admin/user">ユーザ管理</Link>
							</td>
						</tr>
						<tr>
							<th></th>
							<td>--- 以下開発中 ---</td>
						</tr>
						<tr>
							<th>
								<RiAdminLine />
							</th>
							<td>
								<Link href="/admin/role">三役管理</Link>
							</td>
						</tr>
						<tr>
							<th>
								<LuLockKeyhole />
							</th>
							<td>
								<Link href="/admin/padlock">部室パスワード管理</Link>
							</td>
						</tr>
						<tr>
							<th>
								<MdOutlineEditCalendar />
							</th>
							<td>
								<Link href="/admin/booking">部室予約管理</Link>
							</td>
						</tr>
						<tr>
							<th>
								<RxCrossCircled />
							</th>
							<td>
								<Link href="/admin/booking/forbidden">部室予約禁止日設定</Link>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default AdminMain
