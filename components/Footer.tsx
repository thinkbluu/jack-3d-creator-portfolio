import Link from 'next/link'
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF } from './SegmentContext'

const linkClass =
  'transition-colors hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--hairline)] bg-[var(--shell-warm)] font-sans text-sm text-[var(--ink-3)]">
      <div className="site-container flex flex-col gap-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold text-[var(--ink)]">MAST</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--ink-2)]">Studio</span>
          </p>
          <nav aria-label="Linkuri juridice" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/confidentialitate" className={linkClass}>Confidențialitate</Link>
            <Link href="/cookies" className={linkClass}>Cookies</Link>
            <Link href="/termeni" className={linkClass}>Termeni</Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--hairline)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>© 2026 MAST Studio · MAST Consult S.R.L. · Timișoara</p>
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
