'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import MenuOverlay, { type MenuItem } from '@/components/MenuOverlay'
import { useHref, useUi } from '@/lib/i18n/context'

export type SiteSection = 'servicii' | 'portofoliu' | 'blog' | 'site-gratuit' | 'despre' | 'cariere' | 'contact'

const DARK_VARS = {
  '--ink': '#faf7f2',
  '--ink-2': 'rgba(250, 247, 242, 0.74)',
  '--ink-3': 'rgba(250, 247, 242, 0.6)',
} as React.CSSProperties

/**
 * Site header. `tone` matches the surface below it: `light` on cream pages,
 * `dark` on night/navy pages. `overlay` floats it over a full-bleed hero and
 * gives it a backdrop only once the page scrolls.
 */
export default function SiteHeader({
  current,
  tone = 'light',
  overlay = false,
}: {
  current?: SiteSection
  tone?: 'light' | 'dark'
  overlay?: boolean
}) {
  const href = useHref()
  const { nav } = useUi()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [surfaceTone, setSurfaceTone] = useState(tone)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  const navItems: MenuItem[] = [
    { id: 'servicii', href: href('/servicii'), label: nav.services },
    { id: 'portofoliu', href: href('/portofoliu'), label: nav.portfolio },
    { id: 'blog', href: href('/blog'), label: nav.guide },
    { id: 'despre', href: href('/despre'), label: nav.about },
    { id: 'cariere', href: href('/cariere'), label: nav.careers },
    { id: 'contact', href: href('/contact'), label: nav.contact },
  ]
  const quote: MenuItem = { id: 'cerere-oferta', href: href('/cerere-oferta'), label: nav.quote }
  const inline = navItems.filter((item) => ['servicii', 'portofoliu', 'blog', 'contact'].includes(item.id))

  useEffect(() => {
    let frame = 0
    // Floating over a page of mixed surfaces, the header takes the tone of
    // whatever section sits under it.
    const readTone = () => {
      frame = 0
      setScrolled(window.scrollY > 24)
      if (!overlay) return
      const stack = document.elementsFromPoint(window.innerWidth / 2, 40)
      let next: 'light' | 'dark' = 'light'
      for (const element of stack) {
        if (headerRef.current?.contains(element)) continue
        const surface = element.closest('.tone-cream, .tone-warm, .tone-dark, .tone-navy')
        if (surface) {
          next = surface.matches('.tone-cream, .tone-warm') ? 'light' : 'dark'
          break
        }
      }
      // Pages without a toned section under the header sit on cream.
      setSurfaceTone(next)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(readTone)
    }
    readTone()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [overlay])

  useEffect(() => {
    if (wasOpen.current && !open) menuButtonRef.current?.focus()
    wasOpen.current = open
  }, [open])

  const close = useCallback(() => setOpen(false), [])
  const dark = (overlay ? surfaceTone : tone) === 'dark'
  const surface = overlay
    ? scrolled
      ? dark
        ? 'bg-[rgba(11,15,22,0.72)] backdrop-blur-xl border-b border-[var(--hairline-dark)]'
        : 'bg-[rgba(250,247,242,0.82)] backdrop-blur-xl border-b border-[var(--hairline)]'
      : 'border-b border-transparent'
    : dark
      ? 'bg-[rgba(11,15,22,0.72)] backdrop-blur-xl border-b border-[var(--hairline-dark)]'
      : 'bg-[rgba(250,247,242,0.82)] backdrop-blur-xl border-b border-[var(--hairline)]'

  return (
    <>
      <header
        ref={headerRef}
        className={`${overlay ? 'fixed' : 'sticky'} inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500 ${surface}`}
        style={dark ? DARK_VARS : undefined}
      >
        <nav aria-label={nav.label} className="studio-container flex h-20 items-center justify-between gap-6">
          <Link href={href('/')} className="flex items-center gap-2 text-[var(--ink)]">
            <span
              aria-hidden="true"
              className={`size-[22px] ${dark ? 'bg-[var(--brass-lite)]' : 'bg-[var(--brass)]'}`}
              style={{
                mask: "url('/icons/mast-mark.svg') center / contain no-repeat",
                WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat",
              }}
            />
            <span className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-semibold">MAST</span>
              <span className="font-sans text-[10px] font-medium tracking-[.28em]">STUDIO</span>
              <span className="sr-only">, {nav.home}</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {inline.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={current === item.id ? 'page' : undefined}
                  className="mono-label whitespace-nowrap text-[var(--ink-2)] transition-colors hover:text-[var(--ink)] aria-[current=page]:text-[var(--ink)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <LanguageSwitcher className="hidden md:block" />
            <Link
              href={quote.href}
              data-magnetic
              className={`mono-label hidden whitespace-nowrap rounded-[var(--radius-pill)] px-5 transition-colors sm:inline-flex ${
                dark
                  ? 'bg-[var(--brass-lite)] text-[var(--night)] hover:bg-[var(--on-dark)]'
                  : 'bg-[var(--ink)] text-[var(--shell)] hover:bg-[var(--navy-2)]'
              }`}
            >
              {quote.label}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="studio-menu"
              className={`mono-label flex items-center gap-3 rounded-[var(--radius-pill)] border px-5 transition-colors ${
                dark
                  ? 'border-[var(--hairline-dark)] text-[var(--on-dark)] hover:border-[var(--on-dark)]'
                  : 'border-[var(--hairline)] text-[var(--ink)] hover:border-[var(--ink)]'
              }`}
            >
              {nav.menu}
              <span aria-hidden="true" className="flex gap-[3px]">
                <span className="size-1 rounded-full bg-[var(--brass-lite)]" />
                <span className="size-1 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </nav>
      </header>
      <MenuOverlay open={open} onClose={close} items={navItems} current={current} quote={quote} />
    </>
  )
}
