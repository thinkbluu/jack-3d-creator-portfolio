'use client'

import Link from 'next/link'
import AnpcSalBadge from '@/components/AnpcSalBadge'
import NewsletterForm from '@/components/NewsletterForm'
import TrackedLink from '@/components/TrackedLink'
import { openConsentSettings } from '@/lib/consent'
import { useHref, useLocale, useUi } from '@/lib/i18n/context'
import { getAllServicePages } from '@/lib/services'
import {
  EMAIL,
  EMAIL_HREF,
  LEGAL_NAME,
  PHONE_DISPLAY,
  PHONE_HREF,
  SITE_NAME,
  SOCIAL_LINKS,
  TRADE_REGISTER_NUMBER,
  VAT_ID,
  whatsappUrl,
} from '@/lib/site'

const DARK_VARS = {
  '--ink': '#faf7f2',
  '--ink-2': 'rgba(250, 247, 242, 0.74)',
  '--ink-3': 'rgba(250, 247, 242, 0.6)',
  '--hairline': 'rgba(250, 247, 242, 0.12)',
} as React.CSSProperties

const linkClass =
  'text-[var(--on-dark-2)] transition-colors hover:text-[var(--on-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass-lite)]'

function FooterColumn({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <nav aria-label={title} className="flex flex-col gap-1">
      <p className="mono-label mb-2 text-[var(--brass-lite)]">{title}</p>
      <ul className="flex flex-col">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Site footer. `cta` opens it with "Hai să vorbim." and the three ways to
 * reach us; pages that end with their own call to action pass `cta={false}`.
 * The studio letter sign-up shows unless `letter={false}`.
 */
export default function Footer({ cta = true, letter = true }: { cta?: boolean; letter?: boolean } = {}) {
  const locale = useLocale()
  const href = useHref()
  const { footer, whatsapp, consent, redesign } = useUi()
  const serviceLinks = getAllServicePages(locale).map((service) => ({ href: href(`/servicii/${service.slug}`), label: service.name }))
  // Guides stay on the Romanian URLs: the articles themselves are not translated.
  const guideLinks = footer.guideLinks.map((link) => ({ ...link, href: link.href }))
  const studioLinks = footer.studioLinks.map((link) => ({ ...link, href: href(link.href) }))
  const year = new Date().getFullYear()

  return (
    <footer
      className={`site-foot tone-dark grain relative z-10 overflow-hidden font-sans text-sm ${cta ? '' : 'border-t border-[var(--hairline-dark)]'}`}
      style={DARK_VARS}
    >
      <div className="studio-container relative flex flex-col gap-16 pt-24 pb-10">
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
          <div className={`foot-letter grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end ${cta ? 'border-t border-[var(--hairline-dark)] pt-12' : ''}`}>
            <div>
              <p className="display-xl text-[clamp(2.2rem,4.4vw,4rem)] leading-[0.95] text-[var(--on-dark)]">{redesign.footer.letterTitle}</p>
              <p className="mt-4 max-w-md leading-relaxed text-[var(--on-dark-2)]">{redesign.footer.letterText}</p>
            </div>
            <NewsletterForm placement="footer" />
          </div>
        ) : null}

        <div className="grid gap-10 border-t border-[var(--hairline-dark)] pt-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <p className="max-w-xs leading-relaxed text-[var(--on-dark-2)]">{footer.blurb}</p>
            <address className="flex flex-col items-start not-italic leading-relaxed text-[var(--on-dark-2)]">
              <span className="text-[var(--on-dark)]">{SITE_NAME}</span>
              <span>{footer.location}</span>
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
            <ul className="flex gap-5" aria-label={footer.social}>
              {SOCIAL_LINKS.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className={`${linkClass} font-semibold text-[var(--on-dark)]`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <FooterColumn title={footer.services} links={serviceLinks} />
          <FooterColumn title={footer.guides} links={guideLinks} />
          <FooterColumn title={footer.studio} links={studioLinks} />
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--hairline-dark)] pt-6 text-[var(--on-dark-3)] lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {SITE_NAME} · {LEGAL_NAME} · CUI {VAT_ID} · {footer.register} {TRADE_REGISTER_NUMBER}
          </p>
          <nav aria-label={footer.legal} className="shrink-0">
            <ul className="flex flex-wrap gap-x-5">
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
              <li>
                <Link href={href('/termeni')} className={linkClass}>
                  {footer.terms}
                </Link>
              </li>
            </ul>
          </nav>
          <AnpcSalBadge className="mx-0 self-start lg:self-auto" />
        </div>
      </div>
    </footer>
  )
}
