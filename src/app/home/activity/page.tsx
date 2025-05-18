'use server'

import { Inter } from 'next/font/google'
import Image from 'next/image'
import { createMetaData } from '@/utils/metaData'
import { getGitImageUrl } from '@/utils'

import { FaXTwitter, FaInstagram, FaYoutube } from 'react-icons/fa6'

export async function metadata() {
	return createMetaData({
		title: '活動内容',
		description: '信州大学工学部軽音サークルあしたぼの活動内容です！',
		url: '/home/activity',
	})
}

const inter = Inter({ subsets: ['latin'] })

const Page = async () => {
	return (
		<div className="flex flex-col gap-y-4 mt-6">
			<h1 className="text-4xl text-center">あしたぼの活動内容</h1>
			<div
				className={`flex flex-col justify-start px-6 pb-4 ${inter.className} bg-white rounded-lg shadow`}
			>
				<h2 className="text-xl font-bold my-4">1.サークルの概要</h2>
				<div className="text-base">
					あしたぼは
					<span className="font-bold">信州大学工学部</span>・
					<span className="font-bold">教育学部生</span>と
					<span className="font-bold">長野県立大学生</span>
					が中心となって活動している軽音楽サークルです！
					<br />
					<br />
					大学から楽器を始めた部員も多く、初心者の方でも気軽に参加できます！
				</div>
				<div className="relative w-full h-64">
					<Image
						src={getGitImageUrl("home/activity/activity-5.jpg")}
						alt="あしたぼの活動風景"
						width={240}
						height={180}
						className="rounded-lg mt-2 shadow absolute top-0 left-1/2 -translate-x-20 translate-y-14 object-cover"
					/>
					<Image
						src={getGitImageUrl("home/activity/activity-12.jpg")}
						alt="あしたぼの活動風景"
						width={240}
						height={180}
						className="rounded-lg mt-2 shadow absolute top-1/2 right-1/2 transform translate-x-14 -translate-y-28 -rotate-12"
					/>
				</div>
				<h2 className="text-xl font-bold my-4">2.活動内容</h2>
				<div className="text-base">
					あしたぼでの活動は、主に<span className="font-bold">ライブ</span>と
					<span className="font-bold">部会</span>の2つです
					<br />
					<br />
					<span className="font-bold">サークル主体のライブ</span>
					は、ひと月からふた月に一度の頻度で、信大工学部サークル棟にある音楽室、
					もしくは長野駅周辺のライブハウスにて行っています
					<br />
					また、サークルOB,OGが主体のライブ企画や、ライブハウスの企画などにも参加しています
					<br />
					<br />
					そして、部員の交流のため、毎週木曜日に
					<span className="font-bold">部会</span>を行っています
					<br />
					<br />
					木曜日の夜は、信大工学部近くの若里公園に集まり、みんなでご飯を食べに行きます
					<br />
					先輩や後輩、同期との貴重な交流の場となっています！
				</div>
				<div className="relative w-full h-64">
					<Image
						src={getGitImageUrl("home/activity/activity-11.jpg")}
						alt="信州大学工学部軽音サークルあしたぼの活動風景"
						width={240}
						height={180}
						className="rounded-lg mt-2 shadow absolute top-1/2 left-1/2 transform -translate-x-14 -translate-y-28 rotate-12"
					/>
					<Image
						src={getGitImageUrl("home/activity/activity-10.jpg")}
						alt="信州大学工学部軽音サークルあしたぼの活動風景"
						width={240}
						height={180}
						className="rounded-lg mt-2 shadow absolute top-0 right-1/2 translate-x-20 translate-y-14 object-cover"
					/>
				</div>
				<h2 className="text-xl font-bold my-4">3.年間ライブ日程</h2>
				<div className="text-base">
					年間のざっくりとした予定は以下の通りです
					<br />
					ここに掲載していないライブもたくさんあるので詳細は
					<a href="/home/live" className="text-accent link link-hover">
						こちら
					</a>
					をご確認ください
					<br />
					<br />
					<span className="font-bold">4月</span>：新歓ライブ
					<br />
					<span className="font-bold">5月</span>：さつきライブ
					<br />
					<span className="font-bold">9月</span>：あしたぼライブ
					<br />
					<span className="font-bold">10月</span>：光芒祭
					<br />
					<span className="font-bold">11月</span>：光芒祭アフター
					<br />
					<span className="font-bold">12月</span>：うたかん
					<br />
					<span className="font-bold">3月</span>：ラスコン
					<br />
				</div>
				<div className="relative w-full h-64">
					<Image
						src={getGitImageUrl("home/activity/activity-8.jpg")}
						alt="信州大学工学部軽音サークルあしたぼの活動風景"
						width={240}
						height={180}
						className="rounded-lg mt-2 shadow absolute top-0 left-1/2 -translate-x-20 translate-y-14 object-cover"
					/>
					<Image
						src={getGitImageUrl("home/activity/activity-7.jpg")}
						alt="信州大学工学部軽音サークルあしたぼの活動風景"
						width={240}
						height={180}
						className="rounded-lg mt-2 shadow absolute top-1/2 right-1/2 transform translate-x-14 -translate-y-28 -rotate-12"
					/>
				</div>
				<h2 className="text-xl font-bold my-4">4.各種SNS</h2>
				<div className="text-base">
					あしたぼの活動は、Twitter、Instagram、YouTubeで発信しています
					<br />
					ぜひフォローして最新情報をチェックしてください！
					<br />
					<br />
					<div className="flex flex-row items-center justify-center gap-x-1">
						<a
							href="https://twitter.com/ashitabo_dongri"
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-twitter text-sm"
						>
							<FaXTwitter size={15} />
							Twitter
						</a>
						<a
							href="https://www.instagram.com/ashitabo2023/"
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-instagram text-sm"
						>
							<FaInstagram size={15} />
							Instagram
						</a>
						<a
							href="/video"
							rel="noopener noreferrer"
							className="btn btn-secondary text-sm"
						>
							<FaYoutube size={15} />
							YouTube
						</a>
					</div>
				</div>
				<div className="relative w-full h-64">
					<Image
						src={getGitImageUrl("home/activity/activity-4.jpg")}
						alt="信州大学工学部軽音サークルあしたぼの活動風景"
						width={120}
						height={90}
						className="rounded-lg mt-2 shadow absolute top-1/2 left-1/2 -translate-x-1 -translate-y-2 object-cover -rotate-45"
					/>
					<Image
						src={getGitImageUrl("home/activity/activity-2.jpg")}
						alt="信州大学工学部軽音サークルあしたぼの活動風景"
						width={120}
						height={90}
						className="rounded-lg mt-2 shadow absolute top-1/2 right-1/2 transform -translate-y-28 -rotate-12"
					/>
					<Image
						src={getGitImageUrl("home/activity/activity-1.jpg")}
						alt="信州大学工学部軽音サークルあしたぼの活動風景"
						width={120}
						height={90}
						className="rounded-lg mt-2 shadow absolute top-1/2 right-1/2 -translate-x-4 object-cover rotate-12"
					/>
					<Image
						src={getGitImageUrl("home/activity/activity-9.jpg")}
						alt="信州大学工学部軽音サークルあしたぼの活動風景"
						width={120}
						height={90}
						className="rounded-lg mt-2 shadow absolute top-1/2 left-1/2 translate-x-5 -translate-y-28 -rotate-6"
					/>
					<Image
						src={getGitImageUrl("home/activity/activity-6.jpg")}
						alt="信州大学工学部軽音サークルあしたぼの活動風景"
						width={120}
						height={90}
						className="rounded-lg mt-2 shadow absolute top-1/2 left-1/2 -translate-x-20 -translate-y-14 object-cover"
					/>
				</div>
				<div className="flex flex-row justify-center">
					<a
						className="btn btn-outline w-44 mt-4"
						href="/home"
						rel="noopener noreferrer"
					>
						ホームに戻る
					</a>
				</div>
			</div>
		</div>
	)
}

export default Page
