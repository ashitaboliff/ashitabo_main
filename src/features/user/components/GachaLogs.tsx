'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next-nprogress-bar' // Added useRouter
import { Session } from 'next-auth'
import { GachaSort, GachaData } from '@/features/gacha/types'
import Pagination from '@/components/ui/atoms/Pagination'
import SelectFieldNumber from '@/components/ui/atoms/SelectFieldNumber'
import GachaPreviewPopup, {
	GachaPreviewPopupRef,
} from '@/features/gacha/components/GachaPreviewPopup'
import {
	getGachaByGachaSrcAction,
	// getGachaByUserIdAction, // This will be called by the parent Server Component
} from '@/features/gacha/components/actions'

interface UserGachaLogsProps {
	session: Session // Or just userId: string
	initialGachas: GachaData[]
	initialPageMax: number
	initialCurrentPage: number
	initialLogsPerPage: number
	initialSort: GachaSort
}

const UserGachaLogs = ({
	session,
	initialGachas,
	initialPageMax,
	initialCurrentPage,
	initialLogsPerPage,
	initialSort,
}: UserGachaLogsProps) => {
	const router = useRouter() // Added useRouter
	// const [isLoading, setIsLoading] = useState<boolean>(false) // isLoading can be removed or handled by Suspense in parent
	const [isPopupLoading, setIsPopupLoading] = useState<boolean>(true) // For individual gacha preview
	const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage)
	const [logsPerPage, setLogsPerPage] = useState(initialLogsPerPage)
	const [sort, setSort] = useState<GachaSort>(initialSort)
	const [popupData, setPopupData] = useState<{
		gacha: GachaData
		totalCount: number
	}>()
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<GachaPreviewPopupRef>(undefined)

	// gachas and pageMax are now derived from props
	const gachas = initialGachas
	const pageMax = initialPageMax

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		router.push(
			`?gachaPage=${page}&gachaLimit=${logsPerPage}&gachaSort=${sort}`,
			{ scroll: false },
		)
	}

	const handleLogsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newLogsPerPage = parseInt(e.target.value)
		setLogsPerPage(newLogsPerPage)
		setCurrentPage(1) // Reset to first page
		router.push(`?gachaPage=1&gachaLimit=${newLogsPerPage}&gachaSort=${sort}`, {
			scroll: false,
		})
	}

	const handleSortChange = (newSort: GachaSort) => {
		setSort(newSort)
		setCurrentPage(1) // Reset to first page
		router.push(`?gachaPage=1&gachaLimit=${logsPerPage}&gachaSort=${newSort}`, {
			scroll: false,
		})
	}

	const fetchGachaByGachaSrc = async (gachaSrc: string) => {
		setIsPopupLoading(true)
		const res = await getGachaByGachaSrcAction({
			userId: session.user.id,
			gachaSrc,
		})
		if (res.status === 200) {
			setPopupData(res.response)
			setIsPopupOpen(true)
		}
		setIsPopupLoading(false)
	}

	return (
		<div className="flex flex-col justify-center">
			<div className="flex flex-col gap-y-2">
				<div className="flex flex-row items-center ml-auto space-x-2 w-1/2">
					<p className="text-sm whitespace-nowrap">表示件数:</p>
					<SelectFieldNumber
						name="logsPerPage"
						options={{ '15件': 15, '25件': 25, '35件': 35 }}
						value={logsPerPage}
						onChange={handleLogsPerPageChange}
					/>
				</div>
				<div className="flex flex-row gap-x-2">
					<input
						type="radio"
						name="gachaSort" // Changed name to avoid conflict if on same page as other sort
						value="new"
						checked={sort === 'new'}
						className="btn btn-tetiary btn-sm"
						aria-label="新しい順"
						onChange={() => handleSortChange('new')}
					/>
					<input
						type="radio"
						name="gachaSort"
						value="old"
						checked={sort === 'old'}
						className="btn btn-tetiary btn-sm"
						aria-label="古い順"
						onChange={() => handleSortChange('old')}
					/>
					<input
						type="radio"
						name="gachaSort"
						value="rare"
						checked={sort === 'rare'}
						className="btn btn-tetiary btn-sm"
						aria-label="レア順"
						onChange={() => handleSortChange('rare')}
					/>
					<input
						type="radio"
						name="gachaSort"
						value="notrare"
						checked={sort === 'notrare'}
						className="btn btn-tetiary btn-sm"
						aria-label="コモン順"
						onChange={() => handleSortChange('notrare')}
					/>
				</div>
				{/*isLoading ? ( // isLoading state is removed, parent should handle loading state e.g. with Suspense
					<div
						className={`grid ${logsPerPage % 3 === 0 ? 'grid-cols-3' : 'grid-cols-5'} gap-2`}
					>
						{Array.from({ length: logsPerPage }).map((_, index) => (
							<div key={index} className="skeleton w-full aspect-gacha" />
						))}
					</div>
				) : ( */}
				<div
					className={`grid ${logsPerPage % 3 === 0 ? 'grid-cols-3' : 'grid-cols-5'} gap-2`}
				>
					{gachas.map((gacha) => (
						<img
							key={gacha.id}
							src={gacha.gachaSrc}
							alt="Gacha Preview"
							className="w-full h-auto object-cover rounded cursor-pointer"
							decoding="auto"
							onClick={() => {
								fetchGachaByGachaSrc(gacha.gachaSrc)
							}}
						/>
					))}
				</div>
				{/*)}*/}
				<Pagination
					currentPage={currentPage}
					totalPages={pageMax}
					onPageChange={handlePageChange}
				/>
			</div>
			{popupData && !isPopupLoading && (
				<GachaPreviewPopup
					ref={popupRef}
					frontImage={popupData.gacha.gachaSrc}
					rarity={popupData.gacha.gachaRarity}
					count={popupData.totalCount}
					version={popupData.gacha.gachaVersion}
					getDate={popupData.gacha.createdAt}
					open={isPopupOpen}
					onClose={() => setIsPopupOpen(false)}
				/>
			)}
		</div>
	)
}

export default UserGachaLogs
