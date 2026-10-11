'use client'

import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/** A wide cover that settles from a slight zoom as it scrolls into place. */
export default function ParallaxCover({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.14, 1])
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const radius = useTransform(scrollYProgress, [0.1, 0.45], [28, 8])

  return (
    <motion.div
      ref={ref}
      style={reduced ? { borderRadius: 8 } : { borderRadius: radius }}
      className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--navy)] md:aspect-[2/1]"
    >
      <motion.div style={reduced ? undefined : { scale, y }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          sizes="100vw"
          className="object-cover object-top"
        />
      </motion.div>
    </motion.div>
  )
}
