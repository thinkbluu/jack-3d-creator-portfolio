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

const linkClass =
  'transition-colors hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]'

function FooterColumn({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <nav aria-label={title} className="flex flex-col gap-1">
      <p className="kicker mb-2">{title}</p>
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

export default function Footer() {
  const locale = useLocale()
  const href = useHref()
  const { footer, whatsapp, consent } = useUi()
  const serviceLinks = getAllServicePages(locale).map((service) => ({ href: href(`/servicii/${service.slug}`), label: service.name }))
  // Guides stay on the Romanian URLs: the articles themselves are not translated.
  const guideLinks = footer.guideLinks.map((link) => ({ ...link, href: link.href }))
  const studioLinks = footer.studioLinks.map((link) => ({ ...link, href: href(link.href) }))
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-[var(--hairline)] bg-[var(--shell-warm)] font-sans text-sm text-[var(--ink-2)]">
      <div className="site-container flex flex-col gap-10 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <p className="flex items-center gap-2 text-[var(--ink)]">
              <span aria-hidden="true" className="size-5 bg-[var(--brass)]" style={{ mask: "url('/icons/mast-mark.svg') center / contain no-repeat", WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat" }} />
              <span className="flex items-baseline gap-2">
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '20px' }}>MAST</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '10px', letterSpacing: '.28em' }}>STUDIO</span>
              </span>
            </p>
            <p className="max-w-xs leading-relaxed">
              {footer.blurb}
            </p>
            <address className="flex flex-col items-start not-italic leading-relaxed">
              <span className="text-[var(--ink)]">{SITE_NAME}</span>
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
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className={`${linkClass} font-semibold text-[var(--ink)]`}>
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

        <div className="flex flex-col gap-4 border-t border-[var(--hairline)] pt-6 lg:flex-row lg:items-center lg:justify-between">
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
              <li>
                <Link href={href('/site-gratuit/regulament')} className={linkClass}>{footer.rules}</Link>
              </li>
            </ul>
          </nav>
          <AnpcSalBadge className="mx-0 self-start lg:self-auto" />
        </div>
      </div>
    </footer>
  )
}
