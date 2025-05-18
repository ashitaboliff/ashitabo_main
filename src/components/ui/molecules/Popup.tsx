import React, {
	useImperativeHandle,
	forwardRef,
	useEffect,
	useRef,
	ReactNode,
} from 'react'
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
		id: string // Add id prop for the dialog element
		title: string
		children?: ReactNode
		maxWidth?: string
		open: boolean
		onClose: () => void
		className?: string
	}
>(({ id, title, children, maxWidth, open, onClose, className }, ref) => {
	const dialogRef = useRef<HTMLDialogElement>(null)

	useImperativeHandle(ref, () => ({
		show: () => {
			dialogRef.current?.showModal()
		},
		close: () => {
			// Calling onClose will trigger the parent to set open to false,
			// which in turn will call dialogRef.current?.close() in useEffect.
			onClose()
		},
	}))

	useEffect(() => {
		const dialogElement = dialogRef.current
		const handleEscKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose() // Still call onClose to update parent state
			}
		}

		if (open) {
			dialogElement?.showModal()
			document.addEventListener('keydown', handleEscKey)
			// Basic focus management, dialog element might handle this better.
			const focusableElement = dialogElement?.querySelector(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
			) as HTMLElement | null
			focusableElement?.focus()
		} else {
			dialogElement?.close()
			document.removeEventListener('keydown', handleEscKey)
		}

		// Listen for the native 'close' event on the dialog
		const handleDialogClose = () => {
			if (open) {
				// Prevent calling onClose if already closed by parent
				onClose()
			}
		}
		dialogElement?.addEventListener('close', handleDialogClose)

		return () => {
			document.removeEventListener('keydown', handleEscKey)
			dialogElement?.removeEventListener('close', handleDialogClose)
		}
	}, [open, onClose])

	return (
		<dialog
			id={id}
			ref={dialogRef}
			className="modal modal-bottom sm:modal-middle"
			aria-labelledby="popup-title"
		>
			<div
				className={clsx(
					'modal-box bg-base-100 rounded-lg shadow-lg p-6 relative mx-auto',
					maxWidth ? `max-w-${maxWidth}` : 'max-w-lg',
					className,
				)}
				// onClick={(e) => e.stopPropagation()} // Not needed if using form method="dialog" for close button
			>
				<h2 id="popup-title" className="text-center mb-4 text-xl font-bold">
					{title}
				</h2>
				{/* Close button using form method="dialog" */}
				<form method="dialog" className="absolute right-2 top-2">
					<button
						className="btn btn-sm btn-circle btn-ghost"
						aria-label="閉じる"
					>
						✕
					</button>
				</form>
				<div className={`text-left`}>{children}</div>
				{/* Optional: A main close button at the bottom */}
				{/* <div className="modal-action">
					<form method="dialog">
						<button className="btn">閉じる</button>
					</form>
				</div> */}
			</div>
			{/* Optional: Clicking on backdrop closes the modal */}
			{/* <form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form> */}
		</dialog>
	)
})

Popup.displayName = 'Popup'

export default Popup
