'use client'

import { IoShareSocialSharp } from 'react-icons/io5'
import { CiShare1 } from 'react-icons/ci'

const ShareButton = ({
	url,
	title,
	text,
	isFullButton,
	className,
	isOnlyLine,
}: {
	url: string
	title: string
	text: string
	isFullButton?: boolean
	className?: string
	isOnlyLine?: boolean
}) => {
	const handleShare = async () => {
		if (isOnlyLine) {
			const baseUrl =
				process.env.NEXT_PUBLIC_AUTH_URL || 'https://www.ashitabo.net'
			const shareUrl = `https://social-plugins.line.me/lineit/share?url=${baseUrl}${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
			window.open(shareUrl, '_blank')
		} else {
			const shareData = {
				title: title,
				text: text,
				url: url,
			}
			if (navigator.share) {
				await navigator.share(shareData)
			} else {
				alert('このブラウザはシェア機能に対応していません。')
			}
		}
	}

	return isFullButton ? (
		<button
			type="button"
			className={className || 'btn btn-outline w-full sm:w-auto'}
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
