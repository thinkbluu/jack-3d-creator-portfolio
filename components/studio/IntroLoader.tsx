'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { useUi } from '@/lib/i18n/context'

const KEY = 'mast-intro-seen'

/**
 * A short counter curtain on the first homepage visit of a session. It is
 * drawn by the server and lifted by CSS on its own, so it never blocks a page
 * whose JavaScript is slow; an inline script hides it at once on repeat visits.
 */
export default function IntroLoader() {
  const { redesign } = useUi()
  const countRef = useRef<HTMLSpanElement>(null)

  // Client-side navigation back home: the inline script does not run then.
  useLayoutEffect(() => {
    try {
      if (window.sessionStorage.getItem(KEY)) document.documentElement.dataset.introSeen = '1'
    } catch {}
  }, [])

  useEffect(() => {
    try {
      window.sessionStorage.setItem(KEY, '1')
    } catch {}
    const el = countRef.current
    if (!el || document.documentElement.dataset.introSeen) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1150)
      const eased = 1 - Math.pow(1 - t, 3)
      el.textContent = String(Math.round(eased * 100)).padStart(3, '0')
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem('${KEY}'))document.documentElement.dataset.introSeen='1'}catch(e){}`,
        }}
      />
      <div aria-hidden="true" className="studio-loader tone-dark grain fixed inset-0 z-[120] flex flex-col justify-between">
        <div className="studio-container flex items-center justify-between pt-8">
          <span className="mono-label text-[var(--on-dark-3)]">MAST Studio</span>
          <span className="mono-label text-[var(--on-dark-3)]">{redesign.loader.label}</span>
        </div>
        <div className="studio-container flex items-end justify-between gap-8 pb-8">
          <span className="display-italic max-w-xs text-2xl text-[var(--on-dark-2)]">{redesign.loader.line}</span>
          <span ref={countRef} className="display-xl text-[clamp(5rem,16vw,14rem)] leading-[0.8] text-[var(--on-dark)] tabular-nums">
            000
          </span>
        </div>
        <span className="studio-loader-bar absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[var(--brass-lite)]" />
      </div>
    </>
  )
}
