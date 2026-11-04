'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocale, useUi } from '@/lib/i18n/context'
import { buildNavTree, type NavEntry } from '@/lib/nav-tree'
import type { SiteSection } from '@/components/SiteHeader'

const OPEN_DELAY = 120
const CLOSE_DELAY = 200

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Desktop horizontal navigation (≥1024px). Every panel is server-rendered in
 * the DOM and only hidden with CSS + `inert`, so all links ship in the HTML.
 * Panels open on hover with a short intent delay and on click/Enter/Space via
 * the chevron button; the label itself stays a real link to the section page.
 */
export default function DesktopNav({ current }: { current?: SiteSection }) {
  const locale = useLocale()
  const { nav } = useUi()
  const pathname = usePathname()
  const entries = useMemo(() => buildNavTree(locale), [locale])
  const [openId, setOpenId] = useState<string | null>(null)
  const rootRef = useRef<HTMLUListElement>(null)
  const timers = useRef<{ open?: number; close?: number }>({})

  const close = useCallback(() => setOpenId(null), [])

  // Panels close on route change and on click outside the bar.
  useEffect(() => close(), [pathname, close])
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) close()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [close])
  useEffect(() => () => clearTimeout(timers.current.open), [])

  const cancelTimers = () => {
    clearTimeout(timers.current.open)
    clearTimeout(timers.current.close)
  }
  const scheduleOpen = (id: string) => {
    cancelTimers()
    timers.current.open = window.setTimeout(() => setOpenId(id), OPEN_DELAY)
  }
  const scheduleClose = () => {
    cancelTimers()
    timers.current.close = window.setTimeout(() => setOpenId(null), CLOSE_DELAY)
  }

  const isActive = (entry: NavEntry) =>
    current === entry.id || (entry.id === 'ghiduri' && current === 'blog')

  return (
    <ul ref={rootRef} className="hidden items-center lg:flex" data-desktop-nav>
      {entries.map((entry) => {
        const open = openId === entry.id
        const panelId = `nav-panel-${entry.id}`
        return (
          <li
            key={entry.id}
            className="relative"
            onMouseEnter={() => (entry.panel ? scheduleOpen(entry.id) : cancelTimers())}
            onMouseLeave={() => (openId ? scheduleClose() : undefined)}
            onBlur={(event) => {
              if (openId && !event.currentTarget.contains(event.relatedTarget as Node)) scheduleClose()
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && openId) {
                cancelTimers()
                close()
                event.currentTarget.querySelector<HTMLButtonElement>('button[aria-expanded]')?.focus()
              }
            }}
          >
            <span className="flex items-center">
              <Link
                href={entry.href}
                aria-current={isActive(entry) ? 'page' : undefined}
                className={`mono-label whitespace-nowrap px-2.5 py-2 transition-colors hover:text-[var(--ink)] aria-[current=page]:text-[var(--ink)] ${
                  isActive(entry) ? 'text-[var(--ink)]' : 'text-[var(--ink-2)]'
                }`}
              >
                {entry.label}
              </Link>
              {entry.panel ? (
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  aria-label={`${entry.label}, ${open ? nav.panelClose : nav.panelOpen}`}
                  onClick={() => {
                    cancelTimers()
                    setOpenId(open ? null : entry.id)
                  }}
                  className="-ml-1 flex size-6 items-center justify-center rounded-full text-[var(--ink-3)] transition-colors hover:text-[var(--ink)] aria-expanded:text-[var(--ink)]"
                >
                  <Chevron open={open} />
                </button>
              ) : null}
            </span>

            {entry.panel ? (
              <div
                id={panelId}
                inert={!open}
                className={`nav-panel ${entry.panel.wide ? 'nav-panel-wide' : 'nav-panel-narrow'} ${open ? 'is-open' : ''}`}
              >
                <div className={entry.panel.wide ? 'studio-container' : ''}>
                  <div className={entry.panel.wide ? 'nav-panel-grid' : 'nav-panel-list'}>
                    {entry.panel.groups.map((group) => (
                      <div key={group.id} className="flex flex-col gap-2">
                        {entry.panel && entry.panel.groups.length > 1 ? (
                          <Link href={group.href} className="mono-label nav-group-label" onClick={close}>
                            {group.label}
                          </Link>
                        ) : null}
                        <ul className="flex flex-col">
                          {group.children.map((child) => (
                            <li key={child.href}>
                              <Link href={child.href} className="nav-link" onClick={close}>
                                <span>{child.label}</span>
                                {child.note ? <span className="nav-note">{child.note}</span> : null}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {entry.panel.more.length > 0 ? (
                    <div className="nav-panel-more">
                      {entry.panel.more.map((link) => (
                        <Link key={link.href + link.label} href={link.href} className="mono-label nav-more-link" onClick={close}>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
