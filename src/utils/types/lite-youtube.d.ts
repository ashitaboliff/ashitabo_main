// types/lite-youtube.d.ts
declare namespace JSX {
	interface IntrinsicElements {
		'lite-youtube': React.DetailedHTMLProps<
			React.HTMLAttributes<HTMLElement>,
			HTMLElement
		> & {
			videoid?: string
			playlistid?: string
			style?: React.CSSProperties
			params?: string
			class?: string
			className?: string
		}
	}
}
