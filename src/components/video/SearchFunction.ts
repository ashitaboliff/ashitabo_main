// 激やば検索ロジック、コードよくわからんから仕様だけ乗っけとくね

// 検索の仕方
// ・islistは、型変換を行う際、YoutubeDetailのidやtitle、linkを入れる際どれを用いるかを決めるもの
// ・keywordは、Playlist.title、Playlist.tags、Playlist.Video.title、Playlist.Video.tagsすべてについてkeywordと一致しているものを選ぶためのクエリ。ただしislistが'all'のときはVideo.title、Video.tagsのみ
// ・sortはPlaylistもしくはVideoの撮影日に対して新しい順、古い順とソートを行う。
//   ただしこの撮影日はPlaylistに入っているcreatedAtなどとは全く関係がなく、Playlistのtitleについている日付をもとにする。
//   Playlistのtitleは"サンプルライブ(2024/1/2)"のようなものとなっており、この(2024/1/2)が撮影日となっているため、
//   ここを抽出してソートを行う

// 型変換の仕方
// ・YoutubeDetail.idは、islistが'live'のときは条件にあうPlaylistのid、islistが'all'のときは条件に合うVideoのid
// ・titleはislistが'live'のときは条件にあうPlaylistのtitle、islistが'all'のときは条件に合うVideoのtitle
// ・link、tagsも同様にislistが'live'のときは条件にあうPlaylistのそれ、islistが'all'のときは条件に合うVideoのそれ
// ・liveDateは上記したようにPlaylist.titleの末尾に括弧閉じ、スラッシュ区切りでついてるのでそれをyyyy-MM-ddのフォーマットで保存
// ・playlistIdはislistが'all'のときのみ、Videoの親となっているPlaylistのidを挿入

import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import {
	Playlist,
	YoutubeDetail,
	YoutubeSearchQuery,
} from '@/types/YoutubeTypes'

const parseLiveDate = (title: string): string | null => {
	const dateMatch = title.match(/\((\d{4})\/(\d{1,2})\/(\d{1,2})\)$/)
	if (dateMatch) {
		const [year, month, day] = dateMatch.slice(1).map(Number)
		return format(new Date(year, month - 1, day), 'yyyy-MM-dd', {
			locale: ja,
		})
	}
	return null
}

export const searchYoutubeDetails = (
	playlists: Playlist[],
	query: YoutubeSearchQuery,
): YoutubeDetail[] => {
	const { islist, keyword, sort } = query

	const keywordLower = keyword?.toLowerCase()

	// フィルタリング処理
	const filteredPlaylists = playlists.filter((playlist) => {
		if (!keywordLower) return true // キーワードがない場合はすべてのプレイリストを対象にする

		if (islist === 'live') {
			// islistが'live'のときはPlaylist.titleとPlaylist.tagsのみを検索
			return (
				playlist.title.toLowerCase().includes(keywordLower) ||
				(playlist.tags &&
					playlist.tags.some((tag) => tag.toLowerCase().includes(keywordLower)))
			)
		} else if (islist === 'all') {
			// islistが'all'のときはVideo.titleとVideo.tagsのみを検索
			return playlist.videos.some(
				(video) =>
					video.title.toLowerCase().includes(keywordLower) ||
					(video.tags &&
						video.tags.some((tag) => tag.toLowerCase().includes(keywordLower))),
			)
		}
		return true
	})

	// ソート処理
	const sortedPlaylists = filteredPlaylists.sort((a, b) => {
		const dateA = parseISO(parseLiveDate(a.title) || '')
		const dateB = parseISO(parseLiveDate(b.title) || '')

		if (sort === 'newest') {
			return dateB.getTime() - dateA.getTime() // 新しい順
		} else if (sort === 'oldest') {
			return dateA.getTime() - dateB.getTime() // 古い順
		}
		return 0
	})

	// YoutubeDetailの生成
	const youtubeDetails: YoutubeDetail[] = []

	sortedPlaylists.forEach((playlist) => {
		const liveDate = parseLiveDate(playlist.title)

		if (islist === 'live') {
			// islistが'live'のときはPlaylistの情報をYoutubeDetailに追加
			youtubeDetails.push({
				id: playlist.playlistId,
				title: playlist.title,
				link: playlist.link,
				tags: playlist.tags || [],
				liveDate: liveDate || '',
			})
		} else if (islist === 'all') {
			// islistが'all'のときはVideoの情報をYoutubeDetailに追加
			playlist.videos.forEach((video) => {
				youtubeDetails.push({
					id: video.videoId,
					title: video.title,
					link: video.link,
					tags: video.tags || [],
					liveDate: liveDate || '',
					playlistId: playlist.playlistId, // islistが'all'のときのみplaylistIdを追加
				})
			})
		}
	})

	return youtubeDetails
}
