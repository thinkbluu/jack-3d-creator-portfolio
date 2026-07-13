'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function CompassHUD() {
  const [supportsHUD, setSupportsHUD] = useState(false)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 360])

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    const update = () => setSupportsHUD(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  if (!supportsHUD) return null

  return (
    <button
      type="button"
      aria-label="Înapoi sus"
      onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })}
      className="fixed bottom-8 right-8 z-40 flex h-16 w-16 items-center justify-center opacity-70 transition-opacity duration-200 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]"
    >
      <motion.img
        src="/images/mast-rose.png"
        alt=""
        aria-hidden="true"
        width={56}
        height={56}
        className="h-14 w-14 opacity-60 drop-shadow-[0_8px_14px_rgba(0,0,0,0.3)]"
        style={reduceMotion ? undefined : { rotate: rotation }}
      />
    </button>
  )
}
