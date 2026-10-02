import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'
import SiteHeader from '@/components/SiteHeader'

export const metadata: Metadata = {
  title: { absolute: 'Pagina nu a fost găsită | MAST Studio' },
  description: 'Pagina căutată nu există sau a fost mutată. Vezi serviciile și prețurile, portofoliul, ghidurile despre site-uri sau scrie-ne direct pe WhatsApp.',
  robots: { index: false, follow: true },
}

const helpfulLinks = [
  { href: '/servicii', label: 'Servicii și prețuri' },
  { href: '/portofoliu', label: 'Portofoliu' },
  { href: '/blog', label: 'Ghid' },
  { href: '/contact', label: 'Contact' },
]

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[70vh] items-center bg-[var(--shell)] text-[var(--ink)]">
        <div className="site-container flex max-w-4xl flex-col gap-7 py-24">
          <p className="type-kicker">BRG 404 · În afara hărții</p>
          <h1 className="type-h1 text-balance">Portul acesta nu există.</h1>
          <p className="type-body max-w-2xl !text-[var(--ink-2)]">Coordonatele nu duc la o pagină activă. Întoarce-te la bord și continuă ruta.</p>
          <Link href="/" className="w-fit rounded-full border border-[var(--brass)] px-6 py-3 font-medium text-[var(--brass-ink)] transition-colors hover:bg-[var(--brass)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]">
            Înapoi la MAST Studio
          </Link>
          <nav aria-label="Pagini utile">
            <ul className="flex flex-wrap gap-x-6">
              {helpfulLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-sans text-sm font-semibold text-[var(--ink)] underline underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  )
}
