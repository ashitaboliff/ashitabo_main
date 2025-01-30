import { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { Controller, UseFormSetValue } from 'react-hook-form'
import LabelInputField from '@/components/atoms/LabelInputField'

import { HiMiniXMark } from 'react-icons/hi2'

type TagInputFieldProps = {
	name: string // react-hook-form で管理するフィールド名
	label?: string // ラベルテキスト
	infoDropdown?: ReactNode // ドロップダウン情報
	placeholder?: string // プレースホルダーテキスト
	control?: any
	defaultValue?: string[] // 初期値として渡されるタグの配列
	setValue?: UseFormSetValue<any> // react-hook-form の setValue
}

/**
 * 動的なタグ入力フィールドコンポーネント
 * @param name react-hook-form で管理するフィールド名
 * @param label ラベルテキスト
 * @param placeholder プレースホルダーテキスト
 * @param control react-hook-form の control
 * @param defaultValue 初期値として渡されるタグの配列
 * @param setValue react-hook-form の setValue
 */
const TagInputField = ({
	name,
	label,
	infoDropdown,
	placeholder,
	control,
	defaultValue = [],
	setValue,
}: TagInputFieldProps) => {
	const [tagCount, setTagCount] = useState<number>(
		defaultValue.length > 0 ? defaultValue.length : 1,
	) // タグ入力フィールドの数
	const [tags, setTags] = useState<string[]>(defaultValue) // タグの状態

	// タグの変更を監視し、setValueを呼び出す
	useEffect(() => {
		if (setValue) {
			setValue(name, tags)
		}
	}, [tags, setValue, name])

	// タグ入力フィールドを追加
	const addTagField = () => {
		setTagCount((prev) => prev + 1)
	}

	// タグ入力フィールドを削除
	const removeTagField = (index: number) => {
		setTagCount((prev) => prev - 1)
		setTags((prevTags) => {
			const newTags = prevTags.filter((_, i) => i !== index)
			return newTags
		})
	}

	// タグの値を更新
	const handleTagChange = (index: number, value: string) => {
		setTags((prevTags) => {
			const newTags = [...prevTags]
			newTags[index] = value
			return newTags
		})
	}

	return (
		<div className="space-y-2">
			{label && <LabelInputField label={label} infoDropdown={infoDropdown} />}

			{Array.from({ length: tagCount }).map((_, index) => (
				<div key={index} className="flex items-center space-x-2">
					{control ? ( // control が存在する場合のみ Controller を使用
						<Controller
							name={`${name}.${index}`} // 配列形式でフィールドを管理
							control={control}
							defaultValue={tags[index] || ''} // 初期値を設定
							render={({ field }) => (
								<input
									{...field}
									type="text"
									placeholder={placeholder || `Tag ${index + 1}`}
									className="input input-bordered w-full bg-white"
									value={tags[index] || ''}
									onChange={(e) => {
										field.onChange(e) // react-hook-form のフィールドを更新
										handleTagChange(index, e.target.value) // タグの状態を更新
									}}
								/>
							)}
						/>
					) : (
						<input
							name={name}
							type="text"
							placeholder={placeholder || `Tag ${index + 1}`}
							className="input input-bordered w-full bg-white"
							value={tags[index] || ''}
							onChange={(e) => handleTagChange(index, e.target.value)}
						/>
					)}
					{index > 0 && (
						<button
							type="button"
							onClick={() => removeTagField(index)}
							className="btn btn-circle btn-sm btn-ghost"
						>
							<HiMiniXMark className="text-error" />
						</button>
					)}
				</div>
			))}

			<button
				type="button"
				onClick={addTagField}
				className="btn btn-sm btn-outline"
			>
				+ Add Tag
			</button>
		</div>
	)
}

export default TagInputField
