'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import AnpcSalBadge from '@/components/AnpcSalBadge'
import NewsletterForm from '@/components/NewsletterForm'
import TrackedLink from '@/components/TrackedLink'
import { openConsentSettings } from '@/lib/consent'
import { useHref, useLocale, useUi } from '@/lib/i18n/context'
import { getAllIndustries } from '@/lib/industries'
import { getServicesByGroup } from '@/lib/services'
import {
  EMAIL,
  EMAIL_HREF,
  LEGAL_NAME,
  PHONE_DISPLAY,
  LINKEDIN_URL,
  PHONE_HREF,
  REGISTERED_OFFICE,
  SITE_NAME,
  SOCIAL_LINKS,
  TRADE_REGISTER_NUMBER,
  VAT_ID,
  whatsappUrl,
  YOUTUBE_URL,
} from '@/lib/site'

const DARK_VARS = {
  '--ink': '#faf7f2',
  '--ink-2': 'rgba(250, 247, 242, 0.74)',
  '--ink-3': 'rgba(250, 247, 242, 0.6)',
  '--hairline': 'rgba(250, 247, 242, 0.12)',
} as React.CSSProperties

const linkClass =
  'text-[var(--on-dark-2)] transition-colors hover:text-[var(--on-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass-lite)]'

/**
 * Compact site footer. The full service tree lives in the header now, so the
 * columns list group names only. On mobile the link columns collapse into
 * <details> sections (closed by default); on desktop they are forced open so
 * the whole footer is one short row. The brand block, company data, legal
 * links and the ANPC/SAL badge stay visible without opening anything.
 */
export default function Footer({ cta = true, letter = true }: { cta?: boolean; letter?: boolean } = {}) {
  const locale = useLocale()
  const href = useHref()
  const { footer, whatsapp, consent, redesign, nav } = useUi()
  const serviceGroups = getServicesByGroup(locale)
  const industries = getAllIndustries(locale)
  // Guides stay on the Romanian URLs: the articles themselves are not translated.
  const guideLinks = footer.guideLinks.map((link) => ({ ...link, href: link.href }))
  const studioLinks = footer.studioLinks.map((link) => ({ ...link, href: href(link.href) }))
  const secondaryLinks = ['/newsletter', '/glosar', '/comparatie'].map(
    (path) => footer.studioLinks.find((link) => link.href === path),
  ).filter((link) => link !== undefined)
  const year = new Date().getFullYear()

  // On desktop the collapsible columns render open; on mobile they stay closed.
  const detailsRef = useRef<HTMLDetailsElement[]>([])
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const sync = () => {
      for (const details of detailsRef.current) details.open = query.matches
    }
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  const serviceColumn = [
    ...serviceGroups.map((group) => ({
      href: `${href('/servicii')}#${group.id}`,
      label: group.name[locale],
    })),
    { href: href('/servicii'), label: footer.allServices },
    { href: href('/preturi'), label: nav.pricing },
    { href: href('/verifica-site'), label: nav.checker },
  ]

  const studioColumn = ['/despre', '/portofoliu', '/cum-lucram', '/contact', '/cerere-oferta', '/cariere'].map(
    (path) => ({ href: href(path), label: footer.studioLinks.find((link) => link.href === path)?.label ?? path }),
  )

  const renderColumn = (title: string, links: Array<{ href: string; label: string }>, index: number) => (
    <details
      ref={(element) => {
        if (element) detailsRef.current[index] = element
      }}
      className="foot-details"
    >
      <summary className="mono-label flex cursor-pointer list-none items-center justify-between text-[var(--brass-lite)] [&::-webkit-details-marker]:hidden">
        {title}
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" className="foot-details-plus transition-transform duration-300 lg:hidden">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </summary>
      <nav aria-label={title} className="mt-3 flex flex-col">
        <ul className="flex flex-col">
          {links.map((link) => (
            <li key={link.href + link.label}>
              <Link href={link.href} className={`${linkClass} foot-link`}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  )

  return (
    <footer
      className={`site-foot tone-dark grain relative z-10 overflow-hidden font-sans text-sm ${cta ? '' : 'border-t border-[var(--hairline-dark)]'}`}
      style={DARK_VARS}
    >
      <div className="studio-container relative flex flex-col gap-12 pt-20 pb-8">
        {cta ? (
          <div className="foot-talk">
            <p className="mono-label flex items-center gap-3 text-[var(--on-dark-3)]">
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
              {redesign.footer.kicker}
            </p>
            <p className="foot-talk-title display-xl">{redesign.footer.talk}</p>
            <ul className="foot-talk-links">
              <li>
                <TrackedLink
                  href={whatsappUrl(whatsapp.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="whatsapp_click"
                  eventProperties={{ placement: 'footer_talk' }}
                  className="foot-talk-link"
                >
                  <span className="mono-label">{redesign.footer.whatsapp}</span>
                  <span className="foot-talk-value">{PHONE_DISPLAY}</span>
                  <span aria-hidden="true" className="foot-talk-arrow">
                    ↗
                  </span>
                </TrackedLink>
              </li>
              <li>
                <a href={EMAIL_HREF} className="foot-talk-link">
                  <span className="mono-label">{redesign.footer.email}</span>
                  <span className="foot-talk-value">{EMAIL}</span>
                  <span aria-hidden="true" className="foot-talk-arrow">
                    →
                  </span>
                </a>
              </li>
              <li>
                <Link href={href('/contact')} className="foot-talk-link">
                  <span className="mono-label">{redesign.footer.form}</span>
                  <span className="foot-talk-value">{redesign.footer.headlineAccent}</span>
                  <span aria-hidden="true" className="foot-talk-arrow">
                    →
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        ) : null}

        {letter ? (
          <div className={`foot-letter grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end ${cta ? 'border-t border-[var(--hairline-dark)] pt-10' : ''}`}>
            <div>
              <p className="display-xl text-[clamp(2.2rem,4.4vw,4rem)] leading-[0.95] text-[var(--on-dark)]">{redesign.footer.letterTitle}</p>
              <p className="mt-4 max-w-md leading-relaxed text-[var(--on-dark-2)]">{redesign.footer.letterText}</p>
            </div>
            <NewsletterForm placement="footer" />
          </div>
        ) : null}

        <div className="grid gap-x-10 gap-y-8 border-t border-[var(--hairline-dark)] pt-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <p className="mono-label text-[var(--brass-lite)]">{SITE_NAME}</p>
            <p className="max-w-xs text-[13px] leading-relaxed text-[var(--on-dark-2)]">{footer.blurb}</p>
            <address className="flex flex-col items-start not-italic leading-relaxed text-[var(--on-dark-2)]">
              <span>{REGISTERED_OFFICE}</span>
              <a href={PHONE_HREF} className={linkClass}>
                {PHONE_DISPLAY}
              </a>
              <a href={whatsappUrl(whatsapp.general)} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {footer.whatsapp}: {PHONE_DISPLAY}
              </a>
              <a href={EMAIL_HREF} className={linkClass}>
                {EMAIL}
              </a>
            </address>
            <ul className="flex gap-4" aria-label={footer.social}>
              {SOCIAL_LINKS.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className={`${linkClass} font-semibold text-[var(--on-dark)]`}>
                    {link.label}
                  </a>
                </li>
              ))}
              {LINKEDIN_URL ? (
                <li>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={`${linkClass} text-[var(--on-dark)]`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                    </svg>
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </li>
              ) : null}
              {YOUTUBE_URL ? (
                <li>
                  <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={`${linkClass} text-[var(--on-dark)]`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
                    </svg>
                    <span className="sr-only">YouTube</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          {renderColumn(footer.services, serviceColumn, 0)}
          {renderColumn(footer.solutions, industries.map((industry) => ({ href: href(`/solutii/${industry.slug}`), label: industry.name })), 1)}
          {renderColumn(footer.guides, guideLinks, 2)}
          {renderColumn(footer.studio, studioColumn, 3)}
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--hairline-dark)] pt-5 text-[13px] text-[var(--on-dark-3)] lg:flex-row lg:items-center lg:gap-6">
          <p>
            © {year} {SITE_NAME} · {LEGAL_NAME} · CUI {VAT_ID} · {footer.register} {TRADE_REGISTER_NUMBER}
            {' · '}
            {footer.signature}
          </p>
          <nav aria-label={footer.legal} className="shrink-0">
            <ul className="flex flex-wrap gap-x-4">
              <li>
                <Link href={href('/termeni')} className={linkClass}>
                  {footer.terms}
                </Link>
              </li>
              <li>
                <Link href={href('/confidentialitate')} className={linkClass}>
                  {footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={href('/cookies')} className={linkClass}>
                  {footer.cookies}
                </Link>
              </li>
              <li>
                <button type="button" onClick={openConsentSettings} className={linkClass}>
                  {consent.settings}
                </button>
              </li>
            </ul>
          </nav>
          <nav aria-label={footer.secondary} className="shrink-0">
            <ul className="flex flex-wrap gap-x-4">
              {secondaryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <AnpcSalBadge className="mx-0 self-start lg:ml-auto lg:self-auto" />
        </div>
      </div>
    </footer>
  )
}
