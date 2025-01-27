'use client'

import { useEffect, useState, useMemo } from 'react'
import {
	Playlist,
	YoutubeDetail,
	YoutubeSearchQuery,
} from '@/types/YoutubeTypes'
import SelectField from '@/components/atoms/SelectField'
import { searchYoutubeDetails } from '@/components/video/SearchFunction'
import YoutubeDetailBox from '@/components/video/YoutubeDetailBox'

const VideoSearchResult = ({
	playlists,
	searchQuery,
}: {
	playlists: Playlist[]
	searchQuery: YoutubeSearchQuery
}) => {
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [playlistPerPage, setPlaylistPerPage] = useState<number>(10)

	const youtubeDetails = useMemo(() => {
		return searchYoutubeDetails(playlists, searchQuery)
	}, [playlists, searchQuery.keyword, searchQuery.sort])

	const totalPlaylists = youtubeDetails?.length ?? 0
	const pageMax = Math.ceil(totalPlaylists / playlistPerPage)

	const indexOfLastPlaylist = currentPage * playlistPerPage
	const indexOfFirstPlaylist = indexOfLastPlaylist - playlistPerPage

	const currentPlaylist =
		youtubeDetails?.slice(indexOfFirstPlaylist, indexOfLastPlaylist) ?? []

	return (
		<div className="flex flex-col items-center justify-center gap-y-2">
			<div className="flex flex-row items-center ml-auto space-x-2 w-1/2">
				<p className="text-sm whitespace-nowrap">表示件数:</p>
				<SelectField
					value={playlistPerPage}
					onChange={(e) => {
						setPlaylistPerPage(Number(e.target.value))
						setCurrentPage(1)
					}}
					options={{ 10: '10件', 20: '20件', 50: '50件', 100: '100件' }}
					name="usersPerPage"
				/>
			</div>
			<div className="flex flex-col gap-y-2 border-t border-b border-base-200">
				{currentPlaylist.map((youtubeDetail) => (
					<YoutubeDetailBox
						key={youtubeDetail.id}
						youtubeDetail={youtubeDetail}
						islist={searchQuery.islist ?? 'live'}
					/>
				))}
			</div>
			<div className="join justify-center">
				{Array.from({ length: pageMax }, (_, i) => (
					<button
						key={i}
						className={`join-item btn ${
							currentPage === i + 1 ? 'btn-primary' : 'btn-outline'
						}`}
						onClick={() => setCurrentPage(i + 1)}
					>
						{i + 1}
					</button>
				))}
			</div>
		</div>
	)
}

export default VideoSearchResult
