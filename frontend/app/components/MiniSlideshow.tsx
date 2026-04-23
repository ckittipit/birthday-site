'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const images = [
	'/photos/photo-1.jpeg',
	'/photos/photo-2.jpeg',
	'/photos/photo-3.jpeg',
	'/photos/photo-4.jpeg',
	'/photos/photo-5.jpeg',
	'/photos/photo-6.jpeg',
	'/photos/photo-7.jpeg',
	'/photos/photo-8.jpeg',
	'/photos/photo-9.jpeg',
]

export default function MiniSlideshow() {
	const [currentIndex, setCurrentIndex] = useState(0)

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % images.length)
		}, 2500)

		return () => clearInterval(timer)
	}, [])

	return (
		<div className='relative mx-auto mt-10 flex w-fit justify-center'>
			<div className='rounded-2xl border border-white/50 bg-white/30 p-2 shadow-[--shadow-bloom] backdrop-blur-md'>
				<div className='mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[--color-plum]'>
					Less memories, but countless feelings.
				</div>

				<div className='relative h-60 w-full overflow-hidden rounded-xl sm:h-60 sm:w-full'>
					<AnimatePresence mode='wait'>
						<motion.img
							key={images[currentIndex]}
							src={images[currentIndex]}
							alt={`memory-${currentIndex + 1}`}
							initial={{ opacity: 0, scale: 1.6 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.96 }}
							transition={{ duration: 0.5, ease: 'easeOut' }}
							className='absolute inset-0 h-full w-full object-cover'
						/>
					</AnimatePresence>
				</div>

				<div className='mt-2 flex justify-center gap-1'>
					{images.map((_, index) => (
						<span
							key={index}
							className={`h-1.5 rounded-full transition-all ${
								index === currentIndex
									? 'w-4 bg-[--color-plum]'
									: 'w-1.5 bg-white/70'
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
