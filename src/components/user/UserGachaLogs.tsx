'use client'

import { useState, useEffect, useRef } from 'react'
import { Session } from 'next-auth'
import { GachaSort, GachaData } from '@/types/GachaTypes'
import Pagination from '@/components/atoms/Pagination'
import SelectFieldNumber from '@/components/atoms/SelectFieldNumber'
import GachaPreviewPopup, {
	GachaPreviewPopupRef,
} from '@/components/gacha/GachaPreviewPopup'
import {
	getGachaByUserIdAction,
	getGachaByGachaSrcAction,
} from '@/components/gacha/actions'

const UserGachaLogs = ({ session }: { session: Session }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isPopupLoading, setIsPopupLoading] = useState<boolean>(true)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [logsPerPage, setLogsPerPage] = useState(15)
	const [sort, setSort] = useState<GachaSort>('new')
	const [popupData, setPopupData] = useState<{
		gacha: GachaData
		totalCount: number
	}>()
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
	const popupRef = useRef<GachaPreviewPopupRef>(undefined)

	const [pageMax, setPageMax] = useState<number>(1)
	const [gachas, setGachas] = useState<GachaData[]>([])

	useEffect(() => {
		const fetchGacha = async () => {
			setIsLoading(true)
			const res = await getGachaByUserIdAction({
				userId: session.user.id,
				sort: sort,
				page: currentPage,
				perPage: logsPerPage,
			})
			if (res.status === 200) {
				setGachas(res.response.gacha)
				setPageMax(Math.ceil(res.response.totalCount / logsPerPage))
			}
			setIsLoading(false)
		}
		fetchGacha()
	}, [currentPage, logsPerPage, sort])

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
						onChange={(e) => {
							setLogsPerPage(parseInt(e.target.value))
							setCurrentPage(1)
						}}
					/>
				</div>
				<div className="flex flex-row gap-x-2">
					<input
						type="radio"
						name="sort"
						value="new"
						defaultChecked
						className="btn btn-tetiary btn-sm"
						aria-label="新しい順"
						onChange={() => setSort('new')}
					/>
					<input
						type="radio"
						name="sort"
						value="old"
						className="btn btn-tetiary btn-sm"
						aria-label="古い順"
						onChange={() => setSort('old')}
					/>
					<input
						type="radio"
						name="sort"
						value="rare"
						className="btn btn-tetiary btn-sm"
						aria-label="レア順"
						onChange={() => setSort('rare')}
					/>
					<input
						type="radio"
						name="sort"
						value="notrare"
						className="btn btn-tetiary btn-sm"
						aria-label="コモン順"
						onChange={() => setSort('notrare')}
					/>
				</div>
				{isLoading ? (
					<div
						className={`grid ${logsPerPage % 3 === 0 ? 'grid-cols-3' : 'grid-cols-5'} gap-2`}
					>
						{Array.from({ length: logsPerPage }).map((_, index) => (
							<div key={index} className="skeleton w-full aspect-gacha" />
						))}
					</div>
				) : (
					<div
						className={`grid ${logsPerPage % 3 === 0 ? 'grid-cols-3' : 'grid-cols-5'} gap-2`}
					>
						{gachas.map((gacha) => (
							<img
								key={gacha.id}
								src={gacha.gachaSrc}
								alt="Gacha Preview"
								className="w-full h-auto object-cover rounded cursor-pointer"
								onClick={() => {
									fetchGachaByGachaSrc(gacha.gachaSrc)
								}}
							/>
						))}
					</div>
				)}
				<Pagination
					currentPage={currentPage}
					totalPages={pageMax}
					onPageChange={(page) => setCurrentPage(page)}
				/>
			</div>
			{popupData && !isPopupLoading && (
				<GachaPreviewPopup
					ref={popupRef}
					frontImage={popupData.gacha.gachaSrc}
					rarity={popupData.gacha.gachaRarity}
					count={popupData.totalCount}
					getDate={popupData.gacha.createdAt}
					open={isPopupOpen}
					onClose={() => setIsPopupOpen(false)}
				/>
			)}
		</div>
	)
}

export default UserGachaLogs
