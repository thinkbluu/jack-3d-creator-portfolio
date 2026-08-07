'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      aria-hidden="true"
      // `scroll-progress` carries the prefers-reduced-motion opt-out from globals.css.
      className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px] bg-[var(--brass)]"
      style={{ scaleX, transformOrigin: 'left' }}
    />
  )
}
