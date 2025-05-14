import React, {
	useImperativeHandle,
	forwardRef,
	useEffect,
	useRef,
} from 'react'
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
	const modalBoxRef = useRef<HTMLDivElement>(null)

	useImperativeHandle(ref, () => ({
		show: () => {
			// daisyUIのmodalはopen propで制御するため、このshowは実質onCloseの逆の操作を期待するが、
			// 親コンポーネントでopen stateを管理しているので、ここでは何もしないか、
			// 親のopen stateを変更するコールバックを別途設ける必要がある。
			// 現状のPropsではonCloseしかないので、showの実装は難しい。
			// そのため、親コンポーネントでopen stateをtrueにすることで表示する。
		},
		close: () => onClose(),
	}))

	useEffect(() => {
		const handleEscKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		if (open) {
			document.addEventListener('keydown', handleEscKey)
			// ポップアップが開いたときに最初のフォーカス可能な要素にフォーカスを当てる (簡易的な対応)
			// より完全なフォーカストラップは複雑になるため、ここでは省略
			const focusableElement = modalBoxRef.current?.querySelector(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
			) as HTMLElement | null
			focusableElement?.focus()
		} else {
			document.removeEventListener('keydown', handleEscKey)
		}

		return () => {
			document.removeEventListener('keydown', handleEscKey)
		}
	}, [open, onClose])

	if (!open) {
		return null
	}

	return (
		<div
			className={clsx(
				'modal modal-bottom sm:modal-middle',
				open && 'modal-open',
			)}
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="popup-title" // タイトル要素にid="popup-title"を付与する
		>
			<div
				ref={modalBoxRef}
				className={clsx(
					'modal-box bg-base-100 rounded-lg shadow-lg p-6 relative', // relativeを追加して閉じるボタンを配置しやすくする
					maxWidth ? `max-w-${maxWidth}` : 'max-w-lg', // デフォルトのmax-widthを設定
					className,
				)}
				onClick={(e) => e.stopPropagation()}
			>
				<h2 id="popup-title" className="text-center mb-4 text-xl font-bold">
					{title}
				</h2>
				{/* 閉じるボタンを追加 */}
				<button
					onClick={onClose}
					className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
					aria-label="閉じる"
				>
					✕
				</button>
				<div className={`text-left`}>{children}</div>
			</div>
		</div>
	)
})

Popup.displayName = 'Popup'

export default Popup
