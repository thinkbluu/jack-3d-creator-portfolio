'use client'

import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor]'

/**
 * A small cream dot that inverts whatever sits under it. It grows over
 * interactive elements. CSS hides it on touch screens and for reduced motion,
 * so the native cursor always remains the real pointer.
 */
export default function StudioCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const target = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    let raf = 0
    let visible = false

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
      if (!visible) {
        visible = true
        pos.x = target.x
        pos.y = target.y
        dot.style.opacity = '1'
      }
      const el = event.target instanceof Element ? event.target.closest(INTERACTIVE) : null
      dot.dataset.active = el ? 'true' : 'false'
    }
    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
    }
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.24
      pos.y += (target.y - pos.y) * 0.24
      dot.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <div ref={dotRef} aria-hidden="true" className="studio-cursor" />
}
