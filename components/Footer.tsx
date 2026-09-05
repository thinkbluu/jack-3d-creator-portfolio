import Link from 'next/link'
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF } from './SegmentContext'
import { getAllServicePages } from '@/lib/services'

const linkClass =
  'transition-colors hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]'

export default function Footer() {
  const servicePages = getAllServicePages()

  return (
    <footer className="relative z-10 border-t border-[var(--hairline)] bg-[var(--shell-warm)] font-sans text-sm text-[var(--ink-3)]">
      <div className="site-container flex flex-col gap-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="flex items-center gap-2 text-[var(--ink)]">
            <span aria-hidden="true" className="size-5 bg-[var(--brass)]" style={{ mask: "url('/icons/mast-mark.svg') center / contain no-repeat", WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat" }} />
            <span className="flex items-baseline gap-2">
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '20px' }}>MAST</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '10px', letterSpacing: '.28em' }}>STUDIO</span>
            </span>
          </p>
          <nav aria-label="Servicii" className="flex flex-col gap-2 sm:items-end">
            <span className="kicker">Servicii</span>
            <span className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
              {servicePages.map((service) => (
                <Link key={service.slug} href={`/servicii/${service.slug}`} className={linkClass}>
                  {service.shortName}
                </Link>
              ))}
            </span>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--hairline)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Linkuri juridice" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/despre" className={linkClass}>Despre</Link>
            <Link href="/portofoliu" className={linkClass}>Portofoliu</Link>
            <Link href="/blog" className={linkClass}>Ghid</Link>
            <Link href="/glosar" className={linkClass}>Glosar</Link>
            <Link href="/comparatie" className={linkClass}>Comparație</Link>
            <Link href="/cerere-oferta" className={linkClass}>Cerere ofertă</Link>
            <Link href="/confidentialitate" className={linkClass}>Confidențialitate</Link>
            <Link href="/cookies" className={linkClass}>Cookies</Link>
            <Link href="/termeni" className={linkClass}>Termeni</Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--hairline)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>© 2026 MAST Studio · MAST Consult S.R.L. · CUI RO49626121 · Timișoara, România</p>
            <a href={PHONE_HREF} className={linkClass}>{PHONE_DISPLAY}</a>
            <a href={EMAIL_HREF} className={linkClass}>{EMAIL}</a>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="https://anpc.ro/ce-este-sal" target="_blank" rel="noopener" className={linkClass}>ANPC SAL</a>
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" className={linkClass}>SOL</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
