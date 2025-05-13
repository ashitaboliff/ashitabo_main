'use server'

import list from '@/utils/molecules/FooterList'
import HomePageBar from '@/svg/home/HomePageBar'

const Footer = () => {
	return (
		<footer className="footer bg-bg-white mt-8 flex flex-col items-center">
			<nav className="py-8 px-4 md:p-8 pb-0 w-full max-w-screen-lg mx-auto justify-center relative">
				<div
					className='absolute w-full flex justify-center mt-36 md:mt-8'
				>
					<HomePageBar />
				</div>
				<ul
					className='grid gap-4 p-4 bg-bg-white bg-opacity-80 z-10 grid-cols-2 md:grid-cols-4'
				>
					{list.map(({ title, list }) => (
						<li key={title} className="text-center">
							<h2 className="font-bold text-base text-neutral-content border-l-4 border-tetiary-light pl-2">
								{title}
							</h2>
							{list.map(({ url, title }) => (
								<a
									key={title}
									href={url}
									className="block mt-2 text-sm link link-hover"
									target={url.startsWith('http') ? '_blank' : '_self'}
									rel={url.startsWith('http') ? 'noopener noreferrer' : ''}
								>
									{title}
								</a>
							))}
						</li>
					))}
				</ul>
			</nav>

			<span className="py-6 block text-center text-xs">
				Copyright © {new Date().getFullYear()}{' '}
				<a href="/" className="hover:underline">
					あしたぼ
				</a>{' '}
				All Rights Reserved.
			</span>
		</footer>
	)
}

export default Footer
