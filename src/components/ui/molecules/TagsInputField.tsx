import { ReactNode, useState, useEffect, KeyboardEvent } from 'react'
import { UseFormSetValue, Control, Controller } from 'react-hook-form'
import LabelInputField from '@/components/ui/atoms/LabelInputField'
import { HiMiniXMark } from 'react-icons/hi2'

type TagInputFieldProps = {
	name: string
	label?: string
	infoDropdown?: ReactNode
	placeholder?: string
	control?: Control<any>
	defaultValue?: string[]
	setValue?: UseFormSetValue<any>
	onChange?: (tags: string[]) => void // 外部でタグの変更をハンドリングする場合
}

const TagInputField = ({
	name,
	label,
	infoDropdown,
	placeholder = 'タグを入力しEnterかカンマで追加',
	control,
	defaultValue = [],
	setValue,
	onChange,
}: TagInputFieldProps) => {
	const [tags, setTags] = useState<string[]>(defaultValue)
	const [inputValue, setInputValue] = useState<string>('')

	useEffect(() => {
		setTags(defaultValue)
	}, [defaultValue])

	useEffect(() => {
		if (setValue) {
			setValue(name, tags)
		}
		if (onChange) {
			onChange(tags)
		}
	}, [tags, setValue, name, onChange])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const addTag = (tagValue: string) => {
		const newTag = tagValue.trim()
		if (newTag && !tags.includes(newTag)) {
			setTags([...tags, newTag])
		}
		setInputValue('')
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault()
			addTag(inputValue)
		}
	}

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove))
	}

	const renderInput = (field?: any) => (
		<input
			type="text"
			value={inputValue}
			onChange={(e) => {
				handleInputChange(e)
				if (field) field.onChange(e) // react-hook-form の Controller を使う場合
			}}
			onKeyDown={handleKeyDown}
			placeholder={placeholder}
			className="input input-bordered w-full bg-white text-sm sm:text-base"
		/>
	)

	return (
		<div>
			{label && <LabelInputField label={label} infoDropdown={infoDropdown} />}
			<div className="flex flex-wrap gap-2 py-2 rounded-md items-center">
				{tags.map((tag) => (
					<div
						key={tag}
						className="badge badge-accent badge-outline gap-1 text-xs sm:text-sm"
					>
						<span>{tag}</span>
						<button
							type="button"
							onClick={() => removeTag(tag)}
							className="hover:text-red-500"
							aria-label={`タグ ${tag} を削除`}
						>
							<HiMiniXMark />
						</button>
					</div>
				))}
				{control ? (
					<Controller
						name={name} // react-hook-form が配列としてタグを管理
						control={control}
						defaultValue={tags} // 初期値を設定
						render={({ field }) => renderInput({
							...field,
							onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
								field.onChange(e);
								// フィールド値の同期は親コンポーネントで処理
								if (field.value && JSON.stringify(field.value) !== JSON.stringify(tags)) {
									setTags(field.value || []);
								}
							}
						})}
					/>
				) : (
					renderInput()
				)}
			</div>
		</div>
	)
}

export default TagInputField
