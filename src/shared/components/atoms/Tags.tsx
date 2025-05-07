const Tags = ({
	tags,
	liveOrBand,
	isLink,
	size,
}: {
	tags: string[]
	liveOrBand?: 'live' | 'band'
	isLink?: boolean
	size?: 'text-xs' | 'text-sm' | 'text-base'
}) => {
	const effectiveSize = size || 'text-xs'
	const isInLink = isLink || false
	return (
		<div className="flex flex-row flex-wrap gap-x-1">
			{tags.map((tag: string) => (
				<a
					key={tag}
					href={
						isInLink
							? `/video?liveOrBand=${liveOrBand}&tag=${encodeURIComponent(tag)}`
							: undefined
					}
					className={`text-accent whitespace-nowrap ${effectiveSize} px-1 ${isLink ? 'hover:underline' : ''}`}
				>
					# {tag}
				</a>
			))}
		</div>
	)
}

export default Tags
