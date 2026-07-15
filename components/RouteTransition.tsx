'use client'

import { useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import ChartKicker from './ChartKicker'
import ChartMarks from './ChartMarks'

export default function RouteTransition() {
  const sectionRef = useRef<HTMLElement>(null)
  const roseRef = useRef<HTMLImageElement>(null)
  const roseCenter = useRef({ x: 0, y: 0 })
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const baseRotation = useTransform(scrollYProgress, [0, 0.45], [-140, 0], { clamp: true })
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1], { clamp: true })
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.9, 1], { clamp: true })
  const sprungBase = useSpring(baseRotation, { stiffness: 60, damping: 15 })
  const cursorOffset = useMotionValue(0)
  const sprungCursor = useSpring(cursorOffset, { stiffness: 50, damping: 12 })
  const combined = useTransform(
    [sprungBase, sprungCursor],
    ([base, cursor]) => Number(base) + Number(cursor),
  )

  useEffect(() => {
    if (reduceMotion) return

    const section = sectionRef.current
    const rose = roseRef.current
    const desktopPointer = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    if (!section || !rose || !desktopPointer.matches) return

    const measureRose = () => {
      const rect = rose.getBoundingClientRect()
      roseCenter.current = {
        x: rect.left + window.scrollX + rect.width / 2,
        y: rect.top + window.scrollY + rect.height / 2,
      }
    }
    const handlePointerMove = (event: PointerEvent) => {
      const centerX = roseCenter.current.x - window.scrollX
      const centerY = roseCenter.current.y - window.scrollY
      const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI + 90
      const delta = ((angle - sprungBase.get() + 540) % 360) - 180
      cursorOffset.set(Math.max(-35, Math.min(35, delta)))
    }
    const handlePointerLeave = () => cursorOffset.set(0)
    let resizeTimer = 0
    const handleResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(measureRose, 200)
    }

    measureRose()
    section.addEventListener('pointermove', handlePointerMove, { passive: true })
    section.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.clearTimeout(resizeTimer)
      section.removeEventListener('pointermove', handlePointerMove)
      section.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('resize', handleResize)
      cursorOffset.set(0)
    }
  }, [cursorOffset, reduceMotion, sprungBase])

  return (
    <section ref={sectionRef} id="ruta" className="relative flex min-h-[52vh] items-center bg-[var(--bg)] pb-[6vh] pt-[8vh]">
      <ChartMarks variant="a" />
      <div className="site-container relative flex w-full flex-col items-center">
        <div className="w-full max-w-3xl">
          <ChartKicker bearing="02" label="Ruta e trasată." />
        </div>
        <motion.img
          ref={roseRef}
          data-route-origin="true"
          src="/images/mast-rose.png"
          alt=""
          aria-hidden="true"
          className="mt-8 h-auto w-[200px] md:w-[280px]"
          style={reduceMotion
            ? { opacity: 1, rotate: 0, scale: 1 }
            : { rotate: combined, opacity, scale }}
        />
      </div>
    </section>
  )
}
