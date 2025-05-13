'use server'

import Image from 'next/image'
import { Inter } from 'next/font/google'
import { createMetaData } from '@/utils/metaData'

const inter = Inter({ subsets: ['latin'] })

export async function metadata() {
	return createMetaData({
		title: 'ライブ予定',
		description:
			'あしたぼのライブ予定です。あしたぼ関係のライブ情報を随時更新していきます。見に来てね。',
		url: '/home/live',
	})
}

const Page = async () => {
	return (
		<div className="flex flex-col gap-y-4 mt-6">
			<h1 className="text-4xl text-center">ライブ情報</h1>
			<div
				className={`flex flex-col justify-start px-6 pb-4 ${inter.className} bg-bg-white rounded-lg shadow`}
			>
				<h2 className="text-xl font-bold my-4">4月: 新歓ライブ</h2>
				<div className="text-base">
					4月は新歓ライブを行います。毎年長野駅前のライブハウスJと、信州大学工学部内のサークル棟で行っています！
					<br />
					「あしたぼに入ろうかなぁ～」などと考えている新入生に向けた企画になっています♪
				</div>
				<div className="grid grid-cols-2 gap-4 mt-4">
					<Image
						src="/home/live/1-1.jpg"
						alt="新歓ライブ"
						width={400}
						height={300}
						className="rounded-lg shadow"
					/>
					<Image
						src="/home/live/1-2.jpg"
						alt="新歓ライブ"
						width={400}
						height={300}
						className="rounded-lg shadow"
					/>
					<Image
						src="/home/live/1-3.jpg"
						alt="新歓ライブ"
						width={400}
						height={300}
						className="rounded-lg shadow"
					/>
					<Image
						src="/home/live/1-4.jpg"
						alt="新歓ライブ"
						width={400}
						height={300}
						className="rounded-lg shadow"
					/>
				</div>
				<h2 className="text-xl font-bold my-4">5月: さつきライブ</h2>
				<div className="text-base">
					5月はさつきライブを行います。さつきライブでは4月から入ってきた新入生と、部員が班を組み、その中で歌う曲と演奏する曲を決めてライブをします！
					<br />
					新入生と部員の交流を深めるための企画です！
					<br />
					このライブの前後には交流会としてボウリング大会や信大工学部中庭でのバーベキューなどの催しも開かれます！
				</div>
				<div className="grid grid-cols-3 gap-4 mt-4">
					<Image
						src="/home/live/2-1.jpg"
						alt="さつきライブ"
						width={400}
						height={300}
						className="rounded-lg shadow"
					/>
					<Image
						src="/home/live/2-2.jpg"
						alt="さつきライブ"
						width={400}
						height={300}
						className="rounded-lg shadow"
					/>
					<Image
						src="/home/live/2-4.jpg"
						alt="さつきライブ"
						width={400}
						height={300}
						className="rounded-lg shadow"
					/>
					<Image
						src="/home/live/2-5.jpg"
						alt="さつきライブ"
						width={400}
						height={300}
						className="rounded-lg shadow"
					/>
					<Image
						src="/home/live/2-6.jpg"
						alt="さつきライブ"
						width={400}
						height={300}
						className="rounded-lg shadow"
					/>
					<Image
						src="/home/live/2-7.jpg"
						alt="さつきライブ"
						width={400}
						height={300}
						className="rounded-lg shadow"
					/>
				</div>
				<h2 className="text-xl font-bold my-4">9月: あしたぼライブ</h2>
				<div className="text-base">
					9月はあしたぼライブを行います。あしたぼライブは、信大工学部サークル棟で行われるライブです！
					<br />
					さつきライブが終わり、新入生と上回生の交流も深まったタイミングで行われるライブです！
					<div className="grid grid-cols-2 gap-4 mt-4">
						<Image
							src="/home/live/3-1.jpg"
							alt="あしたぼライブ"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/3-2.jpg"
							alt="あしたぼライブ"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/3-3.jpg"
							alt="あしたぼライブ"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/3-4.jpg"
							alt="あしたぼライブ"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
					</div>
				</div>
				<h2 className="text-xl font-bold my-4">10月: 光芒祭</h2>
				<div className="text-base">
					10月は光芒祭が行われます。光芒祭は信州大学の学園祭で、あしたぼは毎年中庭でのステージライブを行っています！
					<br />
					学内外からたくさんの人が集まる学園祭で、あしたぼのライブも盛り上がります。
					<br />
					ステージに出られるバンドは役員が決めた連度の高いバンドのみです！出られるように頑張りましょう！
					<div className="grid grid-cols-2 gap-4 mt-4">
						<Image
							src="/home/live/4-5.jpg"
							alt="光芒祭"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/4-2.jpg"
							alt="光芒祭"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/4-3.jpg"
							alt="光芒祭"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/4-4.jpg"
							alt="光芒祭"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
					</div>
				</div>
				<h2 className="text-xl font-bold my-4">11月: 光芒祭アフター</h2>
				<div className="text-base">
					11月は光芒祭アフターを行います。光芒祭アフターは光芒祭の約一か月後に行われるライブです！
					<br />
					光芒祭に出られなかったバンドが出られるチャンスです！
					<div className="grid grid-cols-2 gap-4 mt-4">
						<Image
							src="/home/live/5-1.jpg"
							alt="光芒祭アフター"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/5-2.jpg"
							alt="光芒祭アフター"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/5-3.jpg"
							alt="光芒祭アフター"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/5-4.jpg"
							alt="光芒祭アフター"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
					</div>
				</div>
				<h2 className="text-xl font-bold my-4">12月: うたかん</h2>
				<div className="text-base">
					12月はうたかんを行います。一年の締めくくりのライブで、今年度卒業するメンバーのいないバンドの部内最後のライブ機会です！
					<br />
					打ち上げではクリスマスに合わせてプレゼント交換や役員交代などのイベントも開催されます！
					<div className="grid grid-cols-3 gap-4 mt-4">
						<Image
							src="/home/live/6-1.jpg"
							alt="うたかん"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/6-2.jpg"
							alt="うたかん"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/6-3.jpg"
							alt="うたかん"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/6-4.jpg"
							alt="うたかん"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/6-5.jpg"
							alt="うたかん"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/6-6.jpg"
							alt="うたかん"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
					</div>
				</div>
				<h2 className="text-xl font-bold my-4">3月: ラスコン</h2>
				<div className="text-base">
					3月はラスコンを行います。ラスコンは部内最後のライブで、卒業生を送るライブです！
					<br />
					卒業生のいるバンドのみが出演でき、卒業生の思い出を共有するようなライブです！
					<div className="grid grid-cols-2 gap-4 mt-4">
						<Image
							src="/home/live/7-1.jpg"
							alt="ラスコン"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/7-2.jpg"
							alt="ラスコン"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/7-3.jpg"
							alt="ラスコン"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/7-4.jpg"
							alt="ラスコン"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/7-5.jpg"
							alt="ラスコン"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/7-6.jpg"
							alt="ラスコン"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/7-7.jpg"
							alt="ラスコン"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
						<Image
							src="/home/live/7-8.jpg"
							alt="ラスコン"
							width={400}
							height={300}
							className="rounded-lg shadow"
						/>
					</div>
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
