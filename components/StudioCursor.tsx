'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor]'
const MAGNET_PULL = 0.3

/**
 * A small cream dot that inverts whatever sits under it. It grows over
 * interactive elements, and over anything with `data-cursor="Label"` it turns
 * into a brass disc carrying that word. Elements marked `data-magnetic` lean
 * toward the pointer. CSS hides the dot on touch screens and for reduced
 * motion, so the native cursor always remains the real pointer.
 */
export default function StudioCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const pathname = usePathname()

  // A new page slides in under a still pointer: drop any label from the old one.
  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return
    dot.dataset.label = 'false'
    dot.dataset.active = 'false'
  }, [pathname])

  useEffect(() => {
    const dot = dotRef.current
    if (!dot || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const target = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    let raf = 0
    let visible = false
    let magnet: HTMLElement | null = null
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const release = () => {
      if (!magnet) return
      magnet.style.transform = ''
      magnet = null
    }

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
      if (!visible) {
        visible = true
        pos.x = target.x
        pos.y = target.y
        dot.style.opacity = '1'
      }
      const element = event.target instanceof Element ? event.target : null
      const interactive = element?.closest(INTERACTIVE)
      const labelled = element?.closest<HTMLElement>('[data-cursor]')
      const label = labelled?.dataset.cursor ?? ''
      dot.dataset.active = interactive ? 'true' : 'false'
      dot.dataset.label = label ? 'true' : 'false'
      if (labelRef.current && labelRef.current.textContent !== label) labelRef.current.textContent = label

      const pull = reduced ? null : element?.closest<HTMLElement>('[data-magnetic]') ?? null
      if (pull !== magnet) release()
      if (pull) {
        magnet = pull
        const rect = pull.getBoundingClientRect()
        const dx = (event.clientX - (rect.left + rect.width / 2)) * MAGNET_PULL
        const dy = (event.clientY - (rect.top + rect.height / 2)) * MAGNET_PULL
        pull.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1)'
        pull.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`
      }
    }
    const onLeave = () => {
      release()
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
      release()
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={dotRef} aria-hidden="true" className="studio-cursor">
      <span ref={labelRef} className="studio-cursor-label" />
    </div>
  )
}
