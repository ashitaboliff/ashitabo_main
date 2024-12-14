import { Part } from '@/types/UserTypes'

import { MdPiano as PianoIcon } from 'react-icons/md'
import { GiGuitarBassHead as BassIcon } from 'react-icons/gi'
import { GiGuitarHead as GuitarIcon } from 'react-icons/gi'
import { GiDrumKit as DrumIcon } from 'react-icons/gi'
import { IoMdMicrophone as MicIcon } from 'react-icons/io'
import { IoEllipsisHorizontalCircleSharp as OtherIcon } from 'react-icons/io5'

export const InstIcon = ({
	part,
	size,
}: {
	part: Part[]
	size: number | undefined
}) => {
	const iconSize = size || 20
	const icons = {
		BACKING_GUITER: <GuitarIcon size={iconSize} />,
		LEAD_GUITER: <GuitarIcon size={iconSize} />,
		BASS: <BassIcon size={iconSize} />,
		DRUMS: <DrumIcon size={iconSize} />,
		KEYBOARD: <PianoIcon size={iconSize} />,
		VOCAL: <MicIcon size={iconSize} />,
		OTHER: <OtherIcon size={iconSize} />,
	}

	return (
		<div className="flex flex-row">
			{part.map((p) => (
				<div key={p} className="mr-2">
					{icons[p]}
				</div>
			))}
		</div>
	)
}
