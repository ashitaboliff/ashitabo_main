'use client'

import { IoShareSocialSharp } from 'react-icons/io5'
import { CiShare1 } from 'react-icons/ci'

const ShareButton = ({
	url,
	title,
	text,
	isFullButton,
}: {
	url: string
	title: string
	text: string
	isFullButton?: boolean
}) => {
	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: title,
					text: text,
					url: url,
				})
			} catch (error) {
				console.error('Web Share APIによる共有に失敗しました。', error)
			}
		} else {
			console.error('Web Share APIに対応していません。')
		}
	}

	return isFullButton ? (
		<button
			type="button"
			className="btn btn-outline w-32"
			onClick={handleShare}
		>
			<div className="flex items-center justify-center">
				<CiShare1 size={15} />
				<span className="ml-2">{title}</span>
			</div>
		</button>
	) : (
		<button type="button" className="btn btn-ghost" onClick={handleShare}>
			<IoShareSocialSharp size={25} />
		</button>
	)
}

export default ShareButton
