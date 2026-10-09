import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'
import { primaryButtonClass, textLinkClass } from '@/components/form-styles'
import LeadId from './LeadId'

export const metadata: Metadata = {
  title: 'Am primit cererea | MAST Studio',
  robots: { index: false, follow: false },
}

export default function MockupThankYouPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-screen items-center justify-center bg-[var(--shell)] px-4 py-16 text-[var(--ink)]">
        <div className="porthole border-[var(--glass-edge)] w-full max-w-xl p-8 text-center md:p-12">
          <h1 className="text-balance font-[family-name:var(--font-display)] text-3xl font-semibold leading-[1.15] sm:text-4xl">
            Am primit. Îți scriem pe WhatsApp în maximum 24 de ore lucrătoare.
          </h1>
          <p className="mx-auto mt-4 max-w-md font-sans text-[15px] leading-relaxed text-[var(--ink-2)] sm:text-base">
            Între timp, poți trimite logo-ul și câteva poze pe WhatsApp, ca mockup-ul să semene cât mai mult cu firma
            ta.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <a
              href="https://wa.me/40746382204"
              target="_blank"
              rel="noopener noreferrer"
              className={`${primaryButtonClass} w-full sm:w-auto`}
            >
              Trimite logo-ul pe WhatsApp
            </a>
            <Link href="/portofoliu" className={textLinkClass}>
              Vezi site-urile făcute de noi
            </Link>
          </div>
          <div className="mt-8">
            <LeadId />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
