// types/lite-youtube.d.ts
declare namespace JSX {
	interface IntrinsicElements {
		'lite-youtube': React.DetailedHTMLProps<
			React.HTMLAttributes<HTMLElement> & {
				videoid: string
				playlistid?: string
				style?: React.CSSProperties
			},
			HTMLElement
		>
	}
}
