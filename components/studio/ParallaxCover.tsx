'use client'

import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

/** A wide cover that settles from a slight zoom as it scrolls into place. */
export default function ParallaxCover({
  src,
  alt,
  priority = false,
  fallbackLabel,
}: {
  src: string
  alt: string
  priority?: boolean
  /** Shown on a neutral block when the cover file is missing. */
  fallbackLabel?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [failed, setFailed] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.14, 1])
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const radius = useTransform(scrollYProgress, [0.1, 0.45], [28, 8])

  return (
    <motion.div
      ref={ref}
      data-expand-target=""
      style={reduced ? { borderRadius: 8 } : { borderRadius: radius }}
      className="relative aspect-[2/1] w-full overflow-hidden bg-[#0b0f17]"
    >
      {failed ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#0b0f17_0%,#1a2230_55%,#0b0f17_100%)] px-6"
        >
          {fallbackLabel ? <span className="kicker text-center text-[#faf7f2]">{fallbackLabel}</span> : null}
        </div>
      ) : (
        <motion.div style={reduced ? undefined : { scale, y }} className="absolute inset-0">
          <Image
            src={src}
            alt={alt}
            fill
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            sizes="100vw"
            onError={() => setFailed(true)}
            className="object-cover object-[right_center]"
          />
        </motion.div>
      )}
    </motion.div>
  )
}
