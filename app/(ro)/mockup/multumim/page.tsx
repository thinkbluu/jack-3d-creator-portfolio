import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'
import MockupConversion from '@/components/MockupConversion'
import LeadId from './LeadId'
import ThankYouBody from './ThankYouBody'

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
            Am primit. Îți trimitem mockup-ul în maximum 24 de ore lucrătoare.
          </h1>
          <ThankYouBody />
          <p className="mt-4 text-sm italic text-[var(--ink-3)]" style={{ fontFamily: 'var(--font-display)' }}>
            Încă un pas spre mai puține site-uri urâte pe internet.
          </p>
          <div className="mt-8">
            <LeadId />
          </div>
          <MockupConversion />
        </div>
      </main>
      <Footer />
    </>
  )
}
