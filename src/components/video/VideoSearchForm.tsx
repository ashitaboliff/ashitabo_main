'use client'

import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { YoutubeSearchQuery } from '@/types/YoutubeTypes'
import TextSearchField from '@/components/molecules/TextSearchField'

const VideoSearchForm = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { register, handleSubmit } = useForm({
		defaultValues: {
			keyword: searchParams.get('keyword') ?? '',
			sort: (searchParams.get('sort') as 'newest' | 'oldest') ?? 'newest',
		},
	})

	const updateQuery = ({ keyword, sort }: YoutubeSearchQuery) => {
		const newParams = new URLSearchParams(searchParams)
		newParams.set('keyword', keyword ?? '')
		newParams.set('sort', sort ?? 'newest')
		router.replace(`/video?${newParams.toString()}`)
	}

	const onSubmit = (data: YoutubeSearchQuery) => {
		updateQuery(data)
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col justify-center gap-y-2 max-w-sm m-auto"
		>
			<div className="flex flex-row items-center gap-x-2">
				<TextSearchField
					register={register('keyword')}
					placeholder="タグ or タイトル"
					className="flex-1"
				/>
				<button type="submit" className="btn btn-primary ml-auto">
					検索
				</button>
			</div>

			<div className="flex flex-row justify-start gap-x-2">
				<input
					type="radio"
					aria-label="新しい順"
					{...register('sort')}
					value="newest"
					className="btn btn-tetiary"
				/>
				<input
					type="radio"
					aria-label="古い順"
					{...register('sort')}
					value="oldest"
					className="btn btn-tetiary"
				/>
			</div>
		</form>
	)
}

export default VideoSearchForm
