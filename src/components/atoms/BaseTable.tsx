import { ReactNode } from 'react'

type DataItem = {
	label: string
	value: string | ReactNode
}

type Props = {
	title: string
	data: DataItem[]
}

/**
 * いい感じのテーブルを表示するコンポーネント
 * @param title テーブルのタイトル
 * @param data テーブルに表示するデータ、LabelとValueの配列で頼んだ
 */

const BaseTable = (props: Props) => {
	return (
		<div className="p-4 flex flex-col justify-center gap-2 mb-4 bg-bg-white shadow-md rounded-md">
			<div className="flex flex-row">
				<p className="text-xl text-text-light text-center font-semibold m-auto">
					{props.title}
				</p>
			</div>
			{props.data.map((item, index) => (
				<div key={index} className="p-2 border-t border-border-light">
					<div className="flex">
						<span className="w-24 p-2 font-semibold">{item.label}:</span>
						<span className="p-2">{item.value}</span>
					</div>
				</div>
			))}
		</div>
	)
}

export default BaseTable
