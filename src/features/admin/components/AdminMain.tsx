'use client'

import Link from 'next/link'

import { LuLockKeyhole } from 'react-icons/lu'
import { FaRegUserCircle, FaYoutube } from 'react-icons/fa'
import { MdOutlineEditCalendar } from 'react-icons/md'
import { RxCrossCircled } from 'react-icons/rx'
import { RiQuestionLine } from 'react-icons/ri'

const AdminMain = () => {
	return (
		<div className="flex flex-col items-center justify-center p-4">
			<div className="text-2xl font-bold">三役用管理ページ</div>
			<div className="overflow-x-auto">
				<table className="table table-lg">
					<tbody>
						<tr>
							<th>
								<RiQuestionLine size={25} />
							</th>
							<td>
								<Link href="/admin/usage">使い方</Link>
							</td>
						</tr>
						<tr>
							<th>
								<FaRegUserCircle size={25} />
							</th>
							<td>
								<Link href="/admin/user">ユーザ管理</Link>
							</td>
						</tr>
						<tr>
							<th>
								<LuLockKeyhole size={25} />
							</th>
							<td>
								<Link href="/admin/padlock">利用登録パスワード管理</Link>
							</td>
						</tr>
						<tr>
							<th>
								<RxCrossCircled size={25} />
							</th>
							<td>
								<Link href="/admin/forbidden">コマ表予約禁止日設定</Link>
							</td>
						</tr>
						<tr>
							<th>
								<FaYoutube size={25} />
							</th>
							<td>
								<Link href="/admin/youtube">YouTube管理</Link>
							</td>
						</tr>
						{/* <tr>
							<th>
								<MdOutlineEditCalendar />
							</th>
							<td>
								<Link href="/admin/booking">部室予約管理</Link>
							</td>
						</tr> */}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default AdminMain
