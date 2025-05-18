interface GachaLogsSkeletonProps {
	logsPerPage: number
}

const GachaLogsSkeleton = ({ logsPerPage }: GachaLogsSkeletonProps) => {
	return (
		<div
			className={`grid ${logsPerPage % 3 === 0 ? 'grid-cols-3' : 'grid-cols-5'} gap-2`}
		>
			{Array.from({ length: logsPerPage }).map((_, index) => (
				<div key={index} className="skeleton w-full aspect-gacha" />
			))}
		</div>
	)
}

export default GachaLogsSkeleton
