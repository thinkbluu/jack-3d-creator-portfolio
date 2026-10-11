'use client'

import Link from 'next/link'
import AnpcSalBadge from '@/components/AnpcSalBadge'
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

/** `cta={false}` drops the closing headline on pages that end with their own call to action. */
export default function Footer({ cta = true }: { cta?: boolean } = {}) {
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
      className={`tone-dark grain relative z-10 overflow-hidden font-sans text-sm ${cta ? '' : 'border-t border-[var(--hairline-dark)]'}`}
      style={DARK_VARS}
    >
      <div className="studio-container relative flex flex-col gap-16 pt-24 pb-10">
        {cta ? (
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <p className="display-xl max-w-4xl text-[clamp(3rem,8vw,7.5rem)] text-[var(--on-dark)]">
              {redesign.footer.headline}
              <br />
              <span className="display-italic text-[var(--brass-lite)]">{redesign.footer.headlineAccent}</span>
            </p>
            <a
              href={whatsappUrl(whatsapp.general)}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              className="shrink-0 self-start rounded-[var(--radius-pill)] bg-[var(--brass-lite)] px-7 text-base font-semibold text-[var(--night)] transition-colors hover:bg-[var(--on-dark)] lg:self-auto"
            >
              {redesign.footer.cta}
            </a>
          </div>
        ) : null}

        <div className={`grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] ${cta ? 'border-t border-[var(--hairline-dark)] pt-12' : ''}`}>
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

        <p
          aria-hidden="true"
          className="display-xl select-none whitespace-nowrap text-center text-[clamp(4rem,17.5vw,17rem)] leading-[0.8] text-[var(--navy-2)]"
        >
          MAST Studio
        </p>

        <div className="flex flex-col gap-4 border-t border-[var(--hairline-dark)] pt-6 text-[var(--on-dark-3)] lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {SITE_NAME} · {LEGAL_NAME} · CUI {VAT_ID} · {footer.register} {TRADE_REGISTER_NUMBER}
          </p>
          <nav aria-label={footer.legal} className="shrink-0">
            <ul className="flex flex-wrap gap-x-5">
              <li>
                <Link href={href('/confidentialitate')} className={linkClass}>{footer.privacy}</Link>
              </li>
              <li>
                <Link href={href('/cookies')} className={linkClass}>{footer.cookies}</Link>
              </li>
              <li>
                <button type="button" onClick={openConsentSettings} className={linkClass}>
                  {consent.settings}
                </button>
              </li>
              <li>
                <Link href={href('/termeni')} className={linkClass}>{footer.terms}</Link>
              </li>
            </ul>
          </nav>
          <AnpcSalBadge className="mx-0 self-start lg:self-auto" />
        </div>
      </div>
    </footer>
  )
}
