import Link from 'next/link'
import AnpcSalBadge from '@/components/AnpcSalBadge'
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

const guideLinks = [
  { href: '/blog/cat-costa-un-site-in-romania', label: 'Cât costă un site în România' },
  { href: '/blog/cat-dureaza-constructia-unui-site', label: 'Cât durează un site' },
  { href: '/blog/site-prezentare-sau-magazin-online', label: 'Site de prezentare sau magazin online' },
  { href: '/blog/cum-alegi-firma-web-design', label: 'Cum alegi o firmă de web design' },
  { href: '/blog', label: 'Toate ghidurile' },
]

const studioLinks = [
  { href: '/despre', label: 'Despre MAST Studio' },
  { href: '/portofoliu', label: 'Portofoliu' },
  { href: '/comparatie', label: 'Freelancer, studio sau agenție' },
  { href: '/glosar', label: 'Glosar web design' },
  { href: '/site-gratuit', label: 'Site gratuit în fiecare lună' },
  { href: '/cariere', label: 'Cariere' },
  { href: '/contact', label: 'Contact' },
  { href: '/cerere-oferta', label: 'Cerere ofertă' },
]

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
  const serviceLinks = getAllServicePages().map((service) => ({ href: `/servicii/${service.slug}`, label: service.name }))
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
              Studio de web design din Timișoara. Site-uri de prezentare de la 300 EUR, live în 48 de ore, magazine online și aplicații pentru afaceri din toată România.
            </p>
            <address className="flex flex-col items-start not-italic leading-relaxed">
              <span className="text-[var(--ink)]">{SITE_NAME}</span>
              <span>Timișoara · lucrăm la distanță în toată România</span>
              <a href={PHONE_HREF} className={linkClass}>
                {PHONE_DISPLAY}
              </a>
              <a href={whatsappUrl('Salut! Vreau să discutăm despre un site pentru afacerea mea.')} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp: {PHONE_DISPLAY}
              </a>
              <a href={EMAIL_HREF} className={linkClass}>
                {EMAIL}
              </a>
            </address>
            <ul className="flex gap-5" aria-label="MAST Studio pe rețelele sociale">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className={`${linkClass} font-semibold text-[var(--ink)]`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <FooterColumn title="Servicii" links={serviceLinks} />
          <FooterColumn title="Ghiduri" links={guideLinks} />
          <FooterColumn title="Studio" links={studioLinks} />
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--hairline)] pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {SITE_NAME} · {LEGAL_NAME} · CUI {VAT_ID} · Reg. Com. {TRADE_REGISTER_NUMBER}
          </p>
          <nav aria-label="Linkuri juridice" className="shrink-0">
            <ul className="flex flex-wrap gap-x-5">
              <li>
                <Link href="/confidentialitate" className={linkClass}>Confidențialitate</Link>
              </li>
              <li>
                <Link href="/cookies" className={linkClass}>Cookies</Link>
              </li>
              <li>
                <Link href="/termeni" className={linkClass}>Termeni</Link>
              </li>
              <li>
                <Link href="/site-gratuit/regulament" className={linkClass}>Regulament concurs</Link>
              </li>
            </ul>
          </nav>
          <AnpcSalBadge className="mx-0 self-start lg:self-auto" />
        </div>
      </div>
    </footer>
  )
}
