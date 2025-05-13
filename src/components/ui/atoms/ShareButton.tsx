'use client'

import { IoShareSocialSharp } from 'react-icons/io5'
import { CiShare1 } from 'react-icons/ci'

const ShareButton = ({
	url,
	title,
	text,
	isFullButton,
	className, // className を追加
}: {
	url: string
	title: string
	text: string
	isFullButton?: boolean
	className?: string // className をオプショナルなpropsとして追加
}) => {
	const handleShare = async () => {
		// 環境変数 NEXT_PUBLIC_AUTH_URL を使うべき (例)
		const baseUrl =
			process.env.NEXT_PUBLIC_AUTH_URL || 'https://www.ashitabo.net'
		const shareUrl = `https://social-plugins.line.me/lineit/share?url=${baseUrl}${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
		window.open(shareUrl, '_blank')
	}

	return isFullButton ? (
		<button
			type="button"
			className={className || 'btn btn-outline w-32'}
			onClick={handleShare}
		>
			<div className="flex items-center justify-center">
				<CiShare1 size={15} />
				<span className="ml-2">{title}</span>
			</div>
		</button>
	) : (
		<button
			type="button"
			className={className || 'btn btn-ghost'}
			onClick={handleShare}
		>
			<IoShareSocialSharp size={25} />
		</button>
	)
}

export default ShareButton
