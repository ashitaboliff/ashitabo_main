import { Part, PartMap } from '@/features/user/types'

import { MdPiano as PianoIcon } from 'react-icons/md'
import { GiGuitarBassHead as BassIcon } from 'react-icons/gi'
import { GiGuitarHead as GuitarIcon } from 'react-icons/gi'
import { FaDrum as DrumIcon } from 'react-icons/fa'
import { IoMdMicrophone as MicIcon } from 'react-icons/io'
import { IoEllipsisHorizontalCircleSharp as OtherIcon } from 'react-icons/io5'

import { useScreenSize } from '@/utils/ScreenSize'

export const InstIcon = ({ part, size }: { part: Part[]; size?: number }) => {
	const iconSize = size || 20
	const width = useScreenSize()

	// アイコン定義
	const icons = {
		VOCAL: <MicIcon size={iconSize} color="#000000" />,
		BACKING_GUITAR: <GuitarIcon size={iconSize} color="#FF6F61" />,
		LEAD_GUITAR: <GuitarIcon size={iconSize} color="#B22222" />,
		BASS: <BassIcon size={iconSize} color="#4169E1" />,
		DRUMS: <DrumIcon size={iconSize} color="#FFC107" />,
		KEYBOARD: <PianoIcon size={iconSize} color="#2A9D8F" />,
		OTHER: <OtherIcon size={iconSize} color="#6C757D" />,
	}

	// 表示順にソート
	const sortedParts = Object.keys(icons).filter((key) =>
		part.includes(key as Part),
	)

	// スマホ画面（width < 768）の場合は4個ごとに改行
	const isMobile = width < 768
	const rows = isMobile ? Math.ceil(sortedParts.length / 4) : 2

	return (
		<div className="flex flex-wrap justify-around">
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<div key={rowIndex} className="flex flex-row mb-2">
					{sortedParts.slice(rowIndex * 4, (rowIndex + 1) * 4).map((p) => (
						<div key={p} className="tooltip mr-1" data-tip={PartMap[p as Part]}>
							<div className="btn btn-sm btn-ghost no-animation btn-circle">
								{icons[p as Part]}
							</div>
						</div>
					))}
				</div>
			))}
		</div>
	)
}

export default InstIcon
