import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import LeadForm from '@/components/LeadForm'

const siteUrl = 'https://maststudio.ro'

export const metadata: Metadata = {
  title: 'Cerere ofertă site web | MAST Studio',
  description:
    'Spune-ne ce tip de proiect ai, iar MAST Studio îți răspunde cu pașii potriviți pentru site-ul, magazinul online sau aplicația ta.',
  alternates: { canonical: `${siteUrl}/cerere-oferta` },
  openGraph: {
    title: 'Cerere ofertă site web | MAST Studio',
    description: 'Trimite detaliile proiectului tău și discută direct cu MAST Studio.',
    url: `${siteUrl}/cerere-oferta`,
    type: 'website',
  },
}

export default function CerereOfertaPage() {
  return (
    <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <section className="site-container pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="flex flex-col gap-6 lg:sticky lg:top-28">
            <p className="kicker">Cerere ofertă</p>
            <div className="flex flex-col gap-4">
              <h1 className="type-h1 max-w-2xl text-balance">Hai să vedem ce are sens pentru proiectul tău.</h1>
              <p className="type-body max-w-xl text-pretty">
                Completează cele trei câmpuri de mai jos. Poți continua direct pe WhatsApp sau ne poți lăsa datele ca să revenim noi.
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-[var(--hairline)] pt-6 font-sans text-sm text-[var(--ink-3)]">
              <p>Fără apeluri de vânzare inutile și fără obligații.</p>
              <p>Primești un răspuns clar despre soluție, buget și următorul pas.</p>
            </div>
          </div>

          <LeadForm variant="page" />
        </div>
      </section>
      <Footer />
    </main>
  )
}
