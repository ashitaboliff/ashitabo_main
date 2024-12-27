import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: '404',
}

export default function NotFound() {
	return (
		<div>
			<h1>404ページ</h1>
		</div>
	)
}
