const Tags = ({
	tags,
	link,
	size,
}: {
	tags: string[]
	link?: string
	size?: 'text-xs' | 'text-sm' | 'text-base'
}) => {
	const effectiveSize = size || 'text-xs'
	return (
		<div className="flex flex-row flex-wrap gap-x-1">
			{tags.map((tag: string) => (
				<a
					key={tag}
					href={link}
					className={`text-accent whitespace-nowrap ${effectiveSize} px-1`}
				>
					# {tag}
				</a>
			))}
		</div>
	)
}

export default Tags
