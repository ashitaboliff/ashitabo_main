import { ReactNode } from 'react'
import IconFactory from '@/svg/IconFactory'

const LabelInputField = ({
	label,
	infoDropdown,
}: {
	label: string
	infoDropdown?: ReactNode
}) => {
	return (
		<label className="label flex flex-row justify-start gap-2">
			{label}
			{infoDropdown && (
				<div className="dropdown dropdown-right">
					<div tabIndex={0} role="button">
						{IconFactory.getIcon({ color: 'info', type: 'info' })}
					</div>
					<div className="card dropdown-content card-sm w-48 bg-white shadow rounded-box p-2 z-10">
						<p className="text-sm">{infoDropdown}</p>
					</div>
				</div>
			)}
		</label>
	)
}

export default LabelInputField
