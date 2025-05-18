interface PaginationProps {
	currentPage: number // 現在のページ
	totalPages: number // 総ページ数
	onPageChange: (page: number) => void // ページ変更時のコールバック
}

const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) => {
	return (
		<div className="join justify-center">
			{totalPages <= 7 ? (
				// ページ数が7以下の場合、すべてのページを表示
				Array.from({ length: totalPages }, (_, i) => (
					<button
						key={i}
						className={`join-item btn ${
							currentPage === i + 1 ? 'btn-primary' : 'btn-outline'
						}`}
						onClick={() => onPageChange(i + 1)}
					>
						{i + 1}
					</button>
				))
			) : (
				// ページ数が8以上の場合、動的にページネーションを表示
				<>
					{/* 最初のページ */}
					<button
						className={`join-item btn ${
							currentPage === 1 ? 'btn-primary' : 'btn-outline'
						}`}
						onClick={() => onPageChange(1)}
					>
						1
					</button>

					{/* 現在のページが4以上の場合、左側に「...」を表示 */}
					{currentPage > 4 && (
						<button className="join-item btn btn-disabled" disabled>
							...
						</button>
					)}

					{/* 現在のページに応じて中央のページを表示 */}
					{Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
						const page =
							Math.max(2, Math.min(currentPage - 1, totalPages - 3)) + i
						if (page < 2 || page >= totalPages) return null // 1と最後のページは除外
						return (
							<button
								key={page}
								className={`join-item btn ${
									currentPage === page ? 'btn-primary' : 'btn-outline'
								}`}
								onClick={() => onPageChange(page)}
							>
								{page}
							</button>
						)
					})}

					{/* 現在のページが最後の3ページ以内でない場合、右側に「...」を表示 */}
					{currentPage < totalPages - 3 && (
						<button className="join-item btn btn-disabled" disabled>
							...
						</button>
					)}

					{/* 最後のページ */}
					<button
						className={`join-item btn ${
							currentPage === totalPages ? 'btn-primary' : 'btn-outline'
						}`}
						onClick={() => onPageChange(totalPages)}
					>
						{totalPages}
					</button>
				</>
			)}
		</div>
	)
}

export default Pagination
