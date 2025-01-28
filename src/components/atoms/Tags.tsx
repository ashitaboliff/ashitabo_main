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
	return (
		<div className="flex flex-row flex-wrap gap-x-1">
			{tags.map((value, index) => (
				<a
					key={index}
					href={
						isLink
							? `/video?liveOrBand=${liveOrBand}&tag=${encodeURIComponent(value)}`
							: undefined
					}
					className={`text-accent whitespace-nowrap ${effectiveSize} px-1 ${isLink ? 'hover:underline' : ''}`}
				>
					# {value}
				</a>
			))}
		</div>
	)
}

export default Tags
