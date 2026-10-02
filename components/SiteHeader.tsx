import Link from 'next/link'
import AnpcSalBadge from '@/components/AnpcSalBadge'

export type SiteSection = 'servicii' | 'portofoliu' | 'blog' | 'site-gratuit' | 'despre' | 'contact'

const navItems: Array<{ id: SiteSection; href: string; label: string }> = [
  { id: 'servicii', href: '/servicii', label: 'Servicii' },
  { id: 'portofoliu', href: '/portofoliu', label: 'Portofoliu' },
  { id: 'blog', href: '/blog', label: 'Ghid' },
  { id: 'site-gratuit', href: '/site-gratuit', label: 'Site gratuit' },
  { id: 'despre', href: '/despre', label: 'Despre' },
  { id: 'contact', href: '/contact', label: 'Contact' },
]

const linkClass =
  'text-xs uppercase tracking-[0.16em] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)] aria-[current=page]:text-[var(--ink)]'

export default function SiteHeader({ current }: { current?: SiteSection }) {
  return (
    <header className="border-b border-[var(--hairline)]">
      <nav aria-label="Navigație principală" className="site-container relative flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 text-[var(--ink)]">
          <span
            aria-hidden="true"
            className="size-[22px] bg-[var(--brass)]"
            style={{
              mask: "url('/icons/mast-mark.svg') center / contain no-repeat",
              WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat",
            }}
          />
          <span className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-semibold">MAST</span>
            <span className="font-sans text-[10px] font-medium tracking-[.28em]">STUDIO</span>
            <span className="sr-only">, pagina principală</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link href={item.href} aria-current={current === item.id ? 'page' : undefined} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/cerere-oferta"
              className="rounded-[var(--radius-pill)] bg-[var(--ink)] px-5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--shell)] transition-colors hover:bg-[#2E2822]"
            >
              Cere ofertă
            </Link>
          </li>
          <li className="hidden xl:block">
            <AnpcSalBadge />
          </li>
        </ul>

        <details className="group md:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)] [&::-webkit-details-marker]:hidden">
            <span>Meniu</span>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" className="transition-transform group-open:rotate-45">
              <path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </summary>
          <ul className="absolute inset-x-0 top-full z-50 flex flex-col border-b border-[var(--hairline)] bg-[var(--shell)] px-6 pb-6 shadow-[0_18px_40px_-24px_rgba(28,24,20,0.55)]">
            {navItems.map((item) => (
              <li key={item.id} className="border-b border-[var(--hairline)]">
                <Link
                  href={item.href}
                  aria-current={current === item.id ? 'page' : undefined}
                  className="w-full py-3 text-lg text-[var(--ink)] aria-[current=page]:font-semibold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link
                href="/cerere-oferta"
                className="w-full justify-center rounded-[var(--radius-pill)] bg-[var(--ink)] px-5 font-semibold text-[var(--shell)]"
              >
                Cere ofertă
              </Link>
            </li>
            <li className="pt-4">
              <AnpcSalBadge />
            </li>
          </ul>
        </details>
      </nav>
    </header>
  )
}
