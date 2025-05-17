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
	setValue?: UseFormSetValue<any> // setValueは直接使用されていないため、将来的な用途がなければ削除も検討
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
	// tagsステートは、controlがない場合、またはdefaultValueの初期値として使用
	const [tags, setTags] = useState<string[]>(defaultValue || [])
	const [inputValue, setInputValue] = useState<string>('')

	// defaultValueが変更された場合、かつcontrolがない場合にtagsを更新
	useEffect(() => {
		if (!control) {
			// defaultValueが実際に変更された場合のみtagsを更新する
			// JSON.stringifyはパフォーマンスに影響する可能性があるため、より効率的な比較方法も検討できる
			if (JSON.stringify(defaultValue) !== JSON.stringify(tags)) {
				setTags(defaultValue || [])
			}
		}
		// controlがある場合は、field.valueが優先されるため、このuseEffectでの更新は不要
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultValue, control]) // controlを依存配列に追加

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const addTagInternal = (
		tagValue: string,
		currentTags: string[],
		fieldOnChange?: (value: string[]) => void,
	) => {
		const newTag = tagValue.trim()
		if (newTag && !currentTags.includes(newTag)) {
			const newTagsArray = [...currentTags, newTag]
			if (fieldOnChange) {
				fieldOnChange(newTagsArray)
			} else if (onChange) {
				setTags(newTagsArray)
				onChange(newTagsArray)
			} else {
				setTags(newTagsArray)
			}
		}
		setInputValue('')
	}

	const removeTagInternal = (
		tagToRemove: string,
		currentTags: string[],
		fieldOnChange?: (value: string[]) => void,
	) => {
		const newTagsArray = currentTags.filter((tag) => tag !== tagToRemove)
		if (fieldOnChange) {
			fieldOnChange(newTagsArray)
		} else if (onChange) {
			setTags(newTagsArray)
			onChange(newTagsArray)
		} else {
			setTags(newTagsArray)
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
						const currentControlledTags = field.value || []

						const handleKeyDownController = (
							e: KeyboardEvent<HTMLInputElement>,
						) => {
							if (e.key === 'Enter' || e.key === ',') {
								e.preventDefault()
								addTagInternal(
									inputValue,
									currentControlledTags,
									field.onChange,
								)
							}
						}

						return (
							<div className="flex flex-wrap gap-2 py-2 rounded-md items-center">
								<div className="flex flex-wrap gap-2">
									{currentControlledTags.map((tag: string) => (
										<div
											key={tag}
											className="badge badge-info badge-outline gap-1 text-xs-custom sm:text-sm"
										>
											<span>{tag}</span>
											<button
												type="button"
												onClick={() =>
													removeTagInternal(
														tag,
														currentControlledTags,
														field.onChange,
													)
												}
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
										// 入力値がある場合のみタグを追加
										if (inputValue.trim()) {
											addTagInternal(
												inputValue,
												currentControlledTags,
												field.onChange,
											)
										}
									}}
								/>
							</div>
						)
					}}
				/>
			) : (
				// controlがない場合のレンダリング (ローカルのtagsステートを使用)
				<div className="flex flex-wrap gap-2 py-2 rounded-md items-center">
					<div className="flex flex-wrap gap-2">
						{tags.map((tag) => (
							<div
								key={tag}
								className="badge badge-info badge-outline gap-1 text-xs-custom sm:text-sm"
							>
								<span>{tag}</span>
								<button
									type="button"
									onClick={() => removeTagInternal(tag, tags, onChange)}
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
						onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
							if (e.key === 'Enter' || e.key === ',') {
								e.preventDefault()
								addTagInternal(inputValue, tags, onChange)
							}
						}}
						placeholder={placeholder}
						className="input input-bordered flex-grow bg-white text-sm sm:text-base min-w-[150px]"
						onBlur={() => {
							if (inputValue.trim()) {
								addTagInternal(inputValue, tags, onChange)
							}
						}}
					/>
				</div>
			)}
		</div>
	)
}

export default TagInputField
