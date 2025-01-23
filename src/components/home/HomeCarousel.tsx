'use client'

import Image from 'next/image'
import list from '@/utils/home/CarouselList'

const Carousel = () => {
	return (
		<div className="carousel w-full mt-4">
			{list.map((image, index) => (
				<div
					id={`slide${index + 1}`}
					className="carousel-item relative w-full"
					key={index}
				>
					<Image
						src={image.src}
						alt={image.alt}
						width={900}
						height={675}
						className="object-cover w-full h-auto"
					/>
					<div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between">
						<a
							href={`#slide${index === 0 ? list.length : index}`}
							className="btn btn-ghost text-bg-white"
						>
							❮
						</a>
						<a
							href={`#slide${(index + 2) % list.length || list.length}`}
							className="btn btn-ghost text-bg-white"
						>
							❯
						</a>
					</div>
				</div>
			))}
		</div>
	)
}

export default Carousel
