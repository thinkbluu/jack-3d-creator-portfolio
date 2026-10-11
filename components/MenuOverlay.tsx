'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { setScrollLocked } from '@/components/SmoothScroll'
import { useHref, useLocale, useUi } from '@/lib/i18n/context'
import { getFeaturedProjects } from '@/lib/projects'
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, SOCIAL_LINKS } from '@/lib/site'

export type MenuItem = { id: string; href: string; label: string }

const DARK_VARS = {
  '--ink': '#faf7f2',
  '--ink-2': 'rgba(250, 247, 242, 0.74)',
  '--ink-3': 'rgba(250, 247, 242, 0.6)',
} as React.CSSProperties

/**
 * Full-screen menu: large links on the left, recent work on the right, so the
 * navigation itself shows what the studio makes. Closes on Escape, on link
 * click and from its own button; focus moves in on open and back out on close.
 */
export default function MenuOverlay({
  open,
  onClose,
  items,
  current,
  quote,
}: {
  open: boolean
  onClose: () => void
  items: MenuItem[]
  current?: string
  quote: MenuItem
}) {
  const locale = useLocale()
  const href = useHref()
  const { redesign, projects: projectsUi } = useUi()
  const closeRef = useRef<HTMLButtonElement>(null)
  const projects = getFeaturedProjects(4, locale)

  useEffect(() => {
    if (!open) return
    setScrollLocked(true)
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      setScrollLocked(false)
    }
  }, [open, onClose])

  return (
    <div
      id="studio-menu"
      role="dialog"
      aria-modal="true"
      aria-label={redesign.menu.label}
      inert={!open}
      data-lenis-prevent
      className="tone-dark grain fixed inset-0 z-[60] overflow-y-auto"
      style={{
        ...DARK_VARS,
        clipPath: open ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
        visibility: open ? 'visible' : 'hidden',
        transition: open
          ? 'clip-path 0.8s cubic-bezier(0.76, 0, 0.24, 1), visibility 0s'
          : 'clip-path 0.6s cubic-bezier(0.76, 0, 0.24, 1), visibility 0s 0.6s',
      }}
    >
      <div className="studio-container relative flex min-h-full flex-col pb-10">
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href={href('/')} onClick={onClose} className="flex items-center gap-2 text-[var(--on-dark)]">
            <span
              aria-hidden="true"
              className="size-[22px] bg-[var(--brass-lite)]"
              style={{
                mask: "url('/icons/mast-mark.svg') center / contain no-repeat",
                WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat",
              }}
            />
            <span className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-semibold">MAST</span>
              <span className="font-sans text-[10px] font-medium tracking-[.28em]">STUDIO</span>
            </span>
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="mono-label rounded-[var(--radius-pill)] bg-[var(--on-dark)] px-5 text-[var(--night)] transition-colors hover:bg-[var(--brass-lite)]"
          >
            {redesign.menu.close}
          </button>
        </div>

        <div className="mt-8 grid flex-1 gap-14 lg:mt-14 lg:grid-cols-[1.25fr_1fr]">
          <nav aria-label={redesign.menu.label}>
            <ul className="flex flex-col">
              {[...items, quote].map((item, index) => (
                <li
                  key={item.id}
                  className="border-b border-[var(--hairline-dark)]"
                  style={{
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateY(0)' : 'translateY(28px)',
                    transition: `opacity 0.7s ease ${0.25 + index * 0.05}s, transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) ${0.25 + index * 0.05}s`,
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={current === item.id ? 'page' : undefined}
                    className="group flex w-full items-baseline gap-5 py-3 text-[var(--on-dark)]"
                  >
                    <span className="mono-label w-8 shrink-0 text-[var(--on-dark-3)]">{String(index + 1).padStart(2, '0')}</span>
                    <span
                      className={`display-xl text-[clamp(2.4rem,6vw,5.25rem)] transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:text-[var(--brass-lite)] ${
                        item.id === quote.id ? 'display-italic text-[var(--brass-lite)]' : ''
                      } ${current === item.id ? 'text-[var(--brass-lite)]' : ''}`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-6">
            <p className="mono-label text-[var(--on-dark-3)]">{redesign.menu.recent}</p>
            <ul className="grid grid-cols-2 gap-4">
              {projects.map((project, index) => (
                <li
                  key={project.slug}
                  style={{
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateY(0)' : 'translateY(40px)',
                    transition: `opacity 0.8s ease ${0.4 + index * 0.08}s, transform 1s cubic-bezier(0.2, 0.7, 0.2, 1) ${0.4 + index * 0.08}s`,
                  }}
                >
                  <Link href={href(`/portofoliu/${project.slug}`)} onClick={onClose} className="link-block group">
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-[14px] bg-[var(--navy)]">
                      <Image
                        src={project.cover}
                        alt={`${projectsUi.altClient} ${project.name}`}
                        fill
                        sizes="(min-width: 1024px) 20vw, 45vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </span>
                    <span className="mt-2 block text-sm text-[var(--on-dark-2)] transition-colors group-hover:text-[var(--on-dark)]">
                      {project.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-[var(--hairline-dark)] pt-6 text-sm text-[var(--on-dark-2)] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6">
            <span className="mono-label text-[var(--on-dark-3)]">{redesign.menu.write}</span>
            <a href={EMAIL_HREF} className="hover:text-[var(--on-dark)]">{EMAIL}</a>
            <a href={PHONE_HREF} className="hover:text-[var(--on-dark)]">{PHONE_DISPLAY}</a>
          </div>
          <div className="flex flex-wrap items-center gap-x-6">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--on-dark)]">
                {link.label}
              </a>
            ))}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  )
}
