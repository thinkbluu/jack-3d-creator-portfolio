'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { pageWordFor } from '@/lib/page-words'

const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)'
const IN_OUT = 'cubic-bezier(0.76, 0, 0.24, 1)'

const frames = (count = 2) =>
  new Promise<void>((resolve) => {
    const step = (left: number) => (left ? requestAnimationFrame(() => step(left - 1)) : resolve())
    step(count)
  })

async function waitFor<T>(find: () => T | null, ms = 1500): Promise<T | null> {
  const start = performance.now()
  while (performance.now() - start < ms) {
    const found = find()
    if (found) return found
    await frames(1)
  }
  return null
}

/** The big opening word of the page now on screen (skipping hidden copies). */
function visibleBigWord() {
  return Array.from(document.querySelectorAll<HTMLElement>('main .page-big')).find((el) => el.getClientRects().length > 0) ?? null
}

function scrollTop() {
  window.__lenis?.scrollTo(0, { immediate: true, force: true })
  window.scrollTo(0, 0)
}

/**
 * Moving between pages, two ways:
 *
 * 1. The word arrives first. A night curtain rises carrying the next page's
 *    big word ("Lucrări."); the route changes underneath, the word settles
 *    exactly where the page has it, and the curtain lifts off the page.
 *    Pages without a big word get the compass instead.
 * 2. A project opens. From a project card (`data-expand`, with its image
 *    marked `data-expand-media`), the cover itself grows into the case
 *    study's cover (`data-expand-target`).
 *
 * Modified clicks, new tabs, downloads, same-page links and
 * `data-no-transition` links are left alone, and visitors who ask for reduced
 * motion navigate instantly.
 */
export default function PageTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const curtainRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLParagraphElement>(null)
  const markRef = useRef<HTMLSpanElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const arrived = useRef<(() => void) | null>(null)
  const clone = useRef<HTMLImageElement | null>(null)

  // Resolve the pending navigation once the new route has committed.
  useEffect(() => {
    const resolve = arrived.current
    arrived.current = null
    resolve?.()
  }, [pathname])

  const navigate = useCallback(
    (url: string) =>
      new Promise<void>((resolve) => {
        let done = false
        const finish = () => {
          if (done) return
          done = true
          window.clearTimeout(timeout)
          resolve()
        }
        // Never leave a curtain down if the route does not change.
        const timeout = window.setTimeout(finish, 4000)
        arrived.current = finish
        router.push(url, { scroll: false })
      }),
    [router],
  )

  const reset = useCallback(() => {
    // Hide first, then drop the held animation frames, so nothing flashes.
    if (curtainRef.current) curtainRef.current.hidden = true
    if (veilRef.current) veilRef.current.hidden = true
    for (const el of [curtainRef.current, maskRef.current, wordRef.current, markRef.current, veilRef.current]) {
      el?.getAnimations().forEach((animation) => animation.cancel())
    }
    clone.current?.remove()
    clone.current = null
    document.querySelectorAll<HTMLElement>('[data-expand-target], [data-expand-media]').forEach((el) => (el.style.visibility = ''))
    busy.current = false
    window.dispatchEvent(new Event('scroll'))
  }, [])

  const wordCurtain = useCallback(
    async (url: string, word: string | null) => {
      const curtain = curtainRef.current
      const mask = maskRef.current
      const wordEl = wordRef.current
      const mark = markRef.current
      if (!curtain || !mask || !wordEl || !mark) return router.push(url)

      wordEl.textContent = word ?? ''
      wordEl.style.setProperty('--len', String(word?.length ?? 1))
      mask.hidden = !word
      mark.hidden = Boolean(word)
      curtain.hidden = false

      const cover = curtain.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }], {
        duration: 480,
        easing: IN_OUT,
        fill: 'forwards',
      })
      const rise = word
        ? wordEl.animate([{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: 640, delay: 160, easing: EASE, fill: 'backwards' })
        : mark.animate([{ opacity: 0, transform: 'rotate(-90deg) scale(0.6)' }, { opacity: 1, transform: 'none' }], {
            duration: 600,
            delay: 160,
            easing: EASE,
            fill: 'backwards',
          })

      await cover.finished
      await navigate(url)
      scrollTop()
      await frames(2)

      if (word) {
        const target = await waitFor(visibleBigWord, 1200)
        await rise.finished
        if (target) {
          // The page's own entrance would fight the hand-over; it is already in place.
          target.style.animation = 'none'
          const from = wordEl.getBoundingClientRect()
          const to = target.getBoundingClientRect()
          const scale = parseFloat(getComputedStyle(target).fontSize) / parseFloat(getComputedStyle(wordEl).fontSize)
          await mask.animate([{ transform: 'none' }, { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${scale || 1})` }], {
            duration: 520,
            easing: IN_OUT,
            fill: 'forwards',
          }).finished
        }
      }

      window.dispatchEvent(new Event('scroll'))
      const lift = curtain.animate([{ clipPath: 'inset(0 0 0% 0)' }, { clipPath: 'inset(0 0 100% 0)' }], {
        duration: 600,
        easing: IN_OUT,
        fill: 'forwards',
      })
      await lift.finished
    },
    [navigate, router],
  )

  const projectOpen = useCallback(
    async (url: string, media: HTMLImageElement) => {
      const veil = veilRef.current
      if (!veil) return router.push(url)
      const from = media.getBoundingClientRect()
      const radius = getComputedStyle(media.closest('[data-expand-frame]') ?? media).borderRadius || '10px'

      const image = document.createElement('img')
      image.src = media.currentSrc || media.src
      image.alt = ''
      image.className = 'pt-clone'
      Object.assign(image.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, borderRadius: radius })
      document.body.appendChild(image)
      clone.current = image
      media.style.visibility = 'hidden'

      veil.hidden = false
      await veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease', fill: 'forwards' }).finished
      await navigate(url)
      scrollTop()
      await frames(2)

      const target = await waitFor(() => document.querySelector<HTMLElement>('[data-expand-target]'), 1500)
      veil.getAnimations().forEach((animation) => animation.cancel())
      const unveil = veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 460, delay: 240, easing: 'ease', fill: 'forwards' })
      if (target) {
        target.style.visibility = 'hidden'
        const to = target.getBoundingClientRect()
        await image.animate(
          [
            { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, borderRadius: radius },
            { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`, borderRadius: getComputedStyle(target).borderRadius || '8px' },
          ],
          { duration: 880, easing: IN_OUT, fill: 'forwards' },
        ).finished
      } else {
        await image.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).finished
      }
      await unveil.finished
    },
    [navigate, router],
  )

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const anchor = event.target instanceof Element ? event.target.closest('a') : null
      if (!anchor || !anchor.href || anchor.hasAttribute('download') || anchor.dataset.noTransition !== undefined) return
      if (anchor.target && anchor.target !== '_self') return
      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      // Same page (a hash, or only a new query such as a filter): no transition.
      if (url.pathname === window.location.pathname) return

      event.preventDefault()
      if (busy.current) return
      busy.current = true
      const destination = url.pathname + url.search + url.hash
      const media = anchor.matches('[data-expand]') ? anchor.querySelector<HTMLImageElement>('img[data-expand-media]') : null
      const run = media ? projectOpen(destination, media) : wordCurtain(destination, pageWordFor(url.pathname))
      Promise.resolve(run).catch(() => undefined).finally(reset)
    }
    // Capture phase, so the click is claimed before Next's own Link handler.
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [projectOpen, reset, wordCurtain])

  // Back and forward never go through the click above; clear anything mid-way.
  useEffect(() => {
    const onPop = () => {
      arrived.current?.()
      reset()
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [reset])

  return (
    <>
      <div ref={veilRef} aria-hidden="true" className="pt-veil" hidden />
      <div ref={curtainRef} aria-hidden="true" className="pt-curtain tone-dark" hidden>
        <div className="studio-container pt-curtain-inner">
          <div ref={maskRef} className="pt-mask">
            <p ref={wordRef} className="page-big display-xl pt-word" />
          </div>
        </div>
        <span
          ref={markRef}
          className="pt-mark"
          style={{
            mask: "url('/icons/mast-mark.svg') center / contain no-repeat",
            WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat",
          }}
        />
      </div>
    </>
  )
}
