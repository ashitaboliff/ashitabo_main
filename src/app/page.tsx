'use client'

import Link from 'next/link'
import React from 'react'
import Template from '@/app/template'

const Page = () => {
	return (
		<Template>
			<div>
				<p>未完成やから待ってて</p>
				<Link href="/booking">予約ページ</Link>
			</div>
		</Template>
	)
}

export default Page
