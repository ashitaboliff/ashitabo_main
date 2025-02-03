import React, { useImperativeHandle, forwardRef } from 'react'
import { ReactNode } from 'react'
import clsx from 'clsx'

export type PopupRef =
	| {
			show: () => void
			close: () => void
	  }
	| undefined

const Popup = forwardRef<
	PopupRef,
	{
		title: string
		children?: ReactNode
		maxWidth?: string
		open: boolean
		onClose: () => void
		className?: string
	}
>(({ title, children, maxWidth, open, onClose, className }, ref) => {
	useImperativeHandle(ref, () => ({
		show: () => onClose(), // Note: It would be better to have a show and close function here
		close: () => onClose(),
	}))

	return (
		<div className={clsx('modal', open && 'modal-open')} onClick={onClose}>
			<div
				className={clsx(
					'modal-box bg-base-100 rounded-lg shadow-lg p-6',
					maxWidth && `max-w-${maxWidth}`,
					className,
				)}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="text-center mb-4 text-xl font-bold">{title}</div>
				<div className={`text-left`}>{children}</div>
			</div>
		</div>
	)
})

Popup.displayName = 'Popup'

export default Popup
