const Loading = () => {
	return (
		<div className="flex items-center justify-center h-48">
			<div className="text-center">
				<span className="loading loading-spinner text-accent loading-lg"></span>
				<div className="text-base mt-4 text-center">Loading...</div>
			</div>
		</div>
	)
}

export default Loading
