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

    // autoRaf lets Lenis own its rAF loop; it handles its own timing, so no
    // stale-time jumps after the page has been idle.
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.15,
      smoothWheel: true,
      anchors: { offset: -88 },
    })
    window.__lenis = lenis

    return () => {
      lenis.destroy()
      if (window.__lenis === lenis) delete window.__lenis
    }
  }, [])

  return null
}
