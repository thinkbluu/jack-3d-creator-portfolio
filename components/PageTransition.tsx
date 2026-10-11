'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Phase = 'idle' | 'cover' | 'reveal'

const COVER_MS = 520
const REVEAL_MS = 700

/**
 * A night curtain between pages, carrying the compass mark, so moving through
 * the site feels like one continuous piece. Internal link clicks are held
 * while the curtain rises, then the route changes underneath it and the
 * curtain lifts off the new page. Modified clicks, new tabs, hash links,
 * downloads and `data-no-transition` links are left alone, and visitors who
 * ask for reduced motion navigate instantly.
 */
export default function PageTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>('idle')
  const pending = useRef<string | null>(null)
  const timer = useRef(0)

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const anchor = event.target instanceof Element ? event.target.closest('a') : null
      if (!anchor || !anchor.href || anchor.hasAttribute('download') || anchor.dataset.noTransition !== undefined) return
      if (anchor.target && anchor.target !== '_self') return
      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      const here = new URL(window.location.href)
      // Same page (a hash, or only a new query such as a filter): no curtain.
      if (url.pathname === here.pathname) return

      event.preventDefault()
      pending.current = url.pathname + url.search + url.hash
      setPhase('cover')
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        if (!pending.current) return
        router.push(pending.current)
        // Never leave the curtain down if the route does not change.
        timer.current = window.setTimeout(() => {
          pending.current = null
          setPhase('reveal')
          timer.current = window.setTimeout(() => setPhase('idle'), REVEAL_MS)
        }, 4000)
      }, COVER_MS)
    }
    // Capture phase, so the click is claimed before Next's own Link handler.
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [router])

  // The new route has rendered under the curtain: lift it.
  useEffect(() => {
    if (!pending.current) return
    pending.current = null
    window.clearTimeout(timer.current)
    window.__lenis?.scrollTo(0, { immediate: true })
    const frame = requestAnimationFrame(() => {
      setPhase('reveal')
      timer.current = window.setTimeout(() => setPhase('idle'), REVEAL_MS)
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <div aria-hidden="true" className="page-curtain" data-phase={phase}>
      <span
        className="page-curtain-mark"
        style={{
          mask: "url('/icons/mast-mark.svg') center / contain no-repeat",
          WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat",
        }}
      />
    </div>
  )
}
