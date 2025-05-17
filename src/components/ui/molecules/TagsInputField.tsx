'use client'

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
	onChange?: (tags: string[]) => void
}

const TagInputField = ({
	name,
	label,
	infoDropdown,
	placeholder = 'タグを入力しEnterかカンマで追加',
	control,
	defaultValue = [],
	onChange,
}: TagInputFieldProps) => {
	const [tags, setTags] = useState<string[]>(defaultValue || [])
	const [inputValue, setInputValue] = useState<string>('')

	useEffect(() => {
		if (JSON.stringify(defaultValue) !== JSON.stringify(tags)) {
			setTags(defaultValue || [])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultValue])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const addTagInternal = (
		tagValue: string,
		fieldOnChange?: (value: string[]) => void,
	) => {
		const newTag = tagValue.trim()
		if (newTag && !tags.includes(newTag)) {
			const newTagsArray = [...tags, newTag]
			setTags(newTagsArray)
			if (fieldOnChange) {
				fieldOnChange(newTagsArray)
			} else if (onChange) {
				onChange(newTagsArray)
			}
		}
		setInputValue('')
	}

	const removeTagInternal = (
		tagToRemove: string,
		fieldOnChange?: (value: string[]) => void,
	) => {
		const newTagsArray = tags.filter((tag) => tag !== tagToRemove)
		setTags(newTagsArray)
		if (fieldOnChange) {
			fieldOnChange(newTagsArray)
		} else if (onChange) {
			onChange(newTagsArray)
		}
	}

	return (
		<div>
			{label && <LabelInputField label={label} infoDropdown={infoDropdown} />}
			{control ? (
				<Controller
					name={name}
					control={control}
					defaultValue={defaultValue || []}
					render={({ field }) => {
						useEffect(() => {
							if (
								Array.isArray(field.value) &&
								JSON.stringify(field.value) !== JSON.stringify(tags)
							) {
								setTags(field.value)
							}
						}, [field.value, tags])

						const handleKeyDownController = (
							e: KeyboardEvent<HTMLInputElement>,
						) => {
							if (e.key === 'Enter' || e.key === ',') {
								e.preventDefault()
								addTagInternal(inputValue, field.onChange)
							}
						}

						return (
							<div className="flex flex-wrap gap-2 py-2 rounded-md items-center">
								<div className="flex flex-wrap gap-2">
									{tags.map((tag) => (
										<div
											key={tag}
											className="badge badge-accent badge-outline gap-1 text-xs sm:text-sm"
										>
											<span>{tag}</span>
											<button
												type="button"
												onClick={() => removeTagInternal(tag, field.onChange)}
												className="text-error"
												aria-label={`タグ ${tag} を削除`}
											>
												<HiMiniXMark />
											</button>
										</div>
									))}
								</div>
								<input
									type="text"
									value={inputValue}
									onChange={handleInputChange}
									onKeyDown={handleKeyDownController}
									placeholder={placeholder}
									className="input input-bordered flex-grow bg-white text-sm sm:text-base min-w-[150px]"
									onBlur={() => {
										if (inputValue.trim()) {
											addTagInternal(inputValue, field.onChange)
										}
									}}
								/>
							</div>
						)
					}}
				/>
			) : (
				// controlがない場合の直接レンダリング
				<div className="flex flex-wrap gap-2 py-2 rounded-md items-center">
					{tags.map((tag) => (
						<div
							key={tag}
							className="badge badge-accent badge-outline gap-1 text-xs sm:text-sm"
						>
							<span>{tag}</span>
							<button
								type="button"
								onClick={() => removeTagInternal(tag, onChange)} // field.onChangeの代わりに直接onChangeを渡す
								className="text-error"
								aria-label={`タグ ${tag} を削除`}
							>
								<HiMiniXMark />
							</button>
						</div>
					))}
					<input
						type="text"
						value={inputValue}
						onChange={handleInputChange}
						onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
							// handleKeyDownControllerの代わりに直接定義
							if (e.key === 'Enter' || e.key === ',') {
								e.preventDefault()
								addTagInternal(inputValue, onChange) // field.onChangeの代わりに直接onChangeを渡す
							}
						}}
						placeholder={placeholder}
						className="input input-bordered flex-grow bg-white text-sm sm:text-base min-w-[150px]"
						onBlur={() => {
							if (inputValue.trim()) {
								addTagInternal(inputValue, onChange) // field.onChangeの代わりに直接onChangeを渡す
							}
						}}
					/>
				</div>
			)}
		</div>
	)
}

export default TagInputField
