import { IoShareSocialSharp } from 'react-icons/io5'

const ShareButton = ({
	url,
	title,
	text,
}: {
	url: string
	title: string
	text: string
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

	return (
		<button onClick={handleShare} className="btn btn-square btn-ghost w-16">
			<IoShareSocialSharp size={25} />
		</button>
	)
}

export default ShareButton
