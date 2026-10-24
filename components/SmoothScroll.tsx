'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/** Pause or resume smooth scrolling, e.g. while a full-screen menu is open. */
export function setScrollLocked(locked: boolean) {
  const lenis = typeof window !== 'undefined' ? window.__lenis : undefined
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  if (typeof document !== 'undefined') {
    document.documentElement.style.overflow = locked ? 'hidden' : ''
  }
}

/**
 * Inertial page scrolling for the whole site. Skipped for visitors who ask for
 * reduced motion, and on touch devices, where native scrolling already feels right.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduce || coarse) return

    // Lenis 1.3 has autoRaf, but its loop never idles — it would keep waking
    // the main thread on a settled page. Drive raf by hand instead: the loop
    // runs only while Lenis is animating and stops shortly after it settles.
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -88 } })
    window.__lenis = lenis

    let raf = 0
    let stopTimer = 0
    const tick = (time: number) => {
      raf = 0
      lenis.raf(time)
      if (lenis.isScrolling !== false) {
        raf = requestAnimationFrame(tick)
        return
      }
      // Settled: give the loop a short grace (a wake may already be in
      // flight), then stop it until the next scroll intent.
      stopTimer = window.setTimeout(() => {
        stopTimer = 0
        if (raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      }, 300)
    }
    const wake = () => {
      if (stopTimer) {
        window.clearTimeout(stopTimer)
        stopTimer = 0
      }
      if (!raf) raf = requestAnimationFrame(tick)
    }

    // Anything that scrolls — smooth inertia, native keyboard or scrollbar
    // scrolling (re-emitted by Lenis), or an explicit scrollTo call — wakes
    // the loop.
    lenis.on('scroll', wake)
    const originalScrollTo = lenis.scrollTo.bind(lenis)
    lenis.scrollTo = ((target: Parameters<Lenis['scrollTo']>[0], options?: Parameters<Lenis['scrollTo']>[1]) => {
      wake()
      return originalScrollTo(target, options)
    }) as Lenis['scrollTo']
    window.addEventListener('wheel', wake, { passive: true })
    window.addEventListener('touchstart', wake, { passive: true })
    window.addEventListener('touchmove', wake, { passive: true })
    const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])
    const onKeyDown = (event: KeyboardEvent) => {
      if (scrollKeys.has(event.key)) wake()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('wheel', wake)
      window.removeEventListener('touchstart', wake)
      window.removeEventListener('touchmove', wake)
      if (stopTimer) window.clearTimeout(stopTimer)
      if (raf) cancelAnimationFrame(raf)
      lenis.destroy()
      if (window.__lenis === lenis) delete window.__lenis
    }
  }, [])

  return null
}
