'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { setScrollLocked } from '@/components/SmoothScroll'
import { useHref, useLocale, useUi } from '@/lib/i18n/context'
import { buildNavTree, type NavChild } from '@/lib/nav-tree'
import { getFeaturedProjects } from '@/lib/projects'
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, SOCIAL_LINKS } from '@/lib/site'

const DARK_VARS = {
  '--ink': '#faf7f2',
  '--ink-2': 'rgba(250, 247, 242, 0.74)',
  '--ink-3': 'rgba(250, 247, 242, 0.6)',
} as React.CSSProperties

function Plus({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Full-screen menu (<1024px): the same tree as the desktop dropdowns, as an
 * accordion — Servicii expands to its four groups, each group to its services.
 * Recent work stays on the right on wide tablets. Closes on Escape, on link
 * click and from its own button; focus moves in on open and back out on close.
 */
export default function MenuOverlay({
  open,
  onClose,
  current,
  quote,
}: {
  open: boolean
  onClose: () => void
  current?: string
  quote?: { id: string; href: string; label: string }
}) {
  const locale = useLocale()
  const href = useHref()
  const { redesign, nav, common } = useUi()
  const closeRef = useRef<HTMLButtonElement>(null)
  const entries = buildNavTree(locale)
  const featured = getFeaturedProjects(4, locale)
  const [openTop, setOpenTop] = useState<string | null>(null)
  const [openGroup, setOpenGroup] = useState<string | null>(null)

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

  const toggleTop = (id: string) => {
    setOpenTop((prev) => (prev === id ? null : id))
    setOpenGroup(null)
  }

  const renderChildren = (children: NavChild[]) =>
    children.map((child) => (
      <li key={child.href + child.label}>
        <Link href={child.href} onClick={onClose} className="block py-3 text-[var(--on-dark-2)] transition-colors hover:text-[var(--brass-lite)]">
          <span className="text-base">{child.label}</span>
          {child.note ? <span className="mt-0.5 block text-xs text-[var(--on-dark-3)]">{child.note}</span> : null}
        </Link>
      </li>
    ))

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
            <span className="wordmark">
              <span>MAST</span> <em>Studio</em>
              <span className="sr-only">, {common.home}</span>
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
              {entries.map((entry) => {
                const expanded = openTop === entry.id
                const active = current === entry.id || (entry.id === 'ghiduri' && current === 'blog')
                return (
                  <li key={entry.id} className="border-b border-[var(--hairline-dark)]">
                    <div className="flex items-center justify-between gap-4">
                      <Link
                        href={entry.href}
                        onClick={onClose}
                        aria-current={current === entry.id ? 'page' : undefined}
                        className={`display-xl py-3 text-[clamp(2rem,5.5vw,4.5rem)] transition-colors duration-300 hover:text-[var(--brass-lite)] ${
                          active ? 'text-[var(--brass-lite)]' : 'text-[var(--on-dark)]'
                        }`}
                      >
                        {entry.label}
                      </Link>
                      {entry.panel ? (
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={`menu-branch-${entry.id}`}
                          aria-label={`${entry.label}, ${expanded ? nav.panelClose : nav.panelOpen}`}
                          onClick={() => toggleTop(entry.id)}
                          className="flex size-12 items-center justify-center rounded-full border border-[var(--hairline-dark)] text-[var(--on-dark-2)] transition-colors hover:border-[var(--brass-lite)] hover:text-[var(--brass-lite)]"
                        >
                          <Plus open={expanded} />
                        </button>
                      ) : null}
                    </div>
                    {entry.panel ? (
                      <div id={`menu-branch-${entry.id}`} hidden={!expanded}>
                        <ul className="flex flex-col pb-4">
                          {entry.panel.groups.map((group) => {
                            const groupOpen = openGroup === group.id
                            return (
                              <li key={group.id} className="border-t border-[var(--hairline-dark)] first:border-t-0">
                                <div className="flex items-center justify-between gap-4">
                                  <Link
                                    href={group.href}
                                    onClick={onClose}
                                    className="mono-label flex-1 py-3 text-[var(--brass-lite)] transition-colors hover:text-[var(--on-dark)]"
                                  >
                                    {group.label}
                                  </Link>
                                  <button
                                    type="button"
                                    aria-expanded={groupOpen}
                                    aria-controls={`menu-group-${group.id}`}
                                    aria-label={`${group.label}, ${groupOpen ? nav.panelClose : nav.panelOpen}`}
                                    onClick={() => setOpenGroup(groupOpen ? null : group.id)}
                                    className="flex size-10 items-center justify-center text-[var(--on-dark-3)] transition-colors hover:text-[var(--brass-lite)]"
                                  >
                                    <Plus open={groupOpen} />
                                  </button>
                                </div>
                                <div id={`menu-group-${group.id}`} hidden={!groupOpen}>
                                  <ul className="flex flex-col pb-2 pl-4">{renderChildren(group.children)}</ul>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                )
              })}
              {quote ? (
                <li className="border-b border-[var(--hairline-dark)]">
                  <Link
                    href={quote.href}
                    onClick={onClose}
                    className="display-xl display-italic block py-3 text-[clamp(2rem,5.5vw,4.5rem)] text-[var(--brass-lite)] transition-colors duration-300 hover:text-[var(--on-dark)]"
                  >
                    {quote.label}
                  </Link>
                </li>
              ) : null}
            </ul>

            <Link
              href={href('/verifica-site')}
              onClick={onClose}
              className="mono-label mt-6 inline-flex items-center gap-3 rounded-[var(--radius-pill)] border border-[var(--hairline-dark)] px-5 py-3 text-[var(--on-dark)] transition-colors hover:border-[var(--brass-lite)] hover:text-[var(--brass-lite)]"
            >
              {nav.checkerFree}
            </Link>
          </nav>

          <div className="hidden flex-col gap-6 lg:flex">
            <p className="mono-label text-[var(--on-dark-3)]">{redesign.menu.recent}</p>
            <ul className="grid grid-cols-2 gap-4">
              {featured.map((project) => (
                <li key={project.slug}>
                  <Link href={href(`/portofoliu/${project.slug}`)} onClick={onClose} className="link-block group">
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-[14px] bg-[#0b0f17]">
                      <Image
                        src={project.cover}
                        alt={project.coverAlt}
                        fill
                        sizes="(min-width: 1024px) 20vw, 45vw"
                        className="object-cover object-[right_center] transition-transform duration-700 ease-out group-hover:scale-105"
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
