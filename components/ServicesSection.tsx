'use client'

import FadeIn from './FadeIn'
import ChartKicker from './ChartKicker'

const services = [
  { number: '01', name: 'Site de prezentare', description: 'Vitrina digitală a afacerii tale: design unic, copy care convinge și PageSpeed 90+ la predare.', price: 'de la 300 EUR · live în 48h de la primirea conținutului' },
  { number: '02', name: 'Magazin online', description: 'eCommerce care convertește: catalog, plăți, comenzi și integrare facturare, fără fricțiune.', price: 'de la 900 EUR · live în 7 zile' },
  { number: '03', name: 'Web & Mobile App', description: 'Aplicații web și mobile pentru operațiuni interne sau experiențe dedicate clienților tăi.', price: 'ofertă personalizată' },
  { number: '04', name: 'Platforme personalizate (SaaS)', description: 'Produse digitale complete: conturi, abonamente, dashboards și automatizări.', price: 'ofertă personalizată' },
]

const continuingServices = [
  { name: 'Mentenanță & creștere', description: 'Administrare, actualizări, SEO continuu și optimizări lunare.', price: 'de la 90 EUR/lună' },
  { name: 'Automatizări & AI', description: 'Chatbot, preluare clienți pe WhatsApp și fluxuri automate care elimină munca repetitivă.', price: 'de la 250 EUR' },
]

function PriceLine({ children }: { children: string }) {
  const [value, ...rest] = children.split(' · ')
  return <p className="mt-3 text-sm font-medium text-[var(--paper-text-2)]"><span className="font-bold text-[var(--gold)]">{value}</span>{rest.length ? ` · ${rest.join(' · ')}` : null}</p>
}

export default function ServicesSection() {
  return (
    <section id="services" className="section-shell rounded-t-[28px] bg-[var(--paper)] text-[var(--paper-text)]">
      <span id="price" className="sr-only" aria-hidden="true" />
      <div className="site-container">
        <FadeIn>
          <header className="section-header">
            <ChartKicker bearing="04" label="Servicii" paper />
            <h2 className="type-h2 !text-[var(--paper-text)]">Servicii</h2>
            <p className="type-body mt-5 !text-[var(--paper-text-2)]">Soluții clare, construite în jurul obiectivelor tale de business.</p>
          </header>
        </FadeIn>

        <div>
          {services.map((service, index) => (
            <FadeIn key={service.number} delay={index * 0.08}>
              <article className="flex items-start gap-6 border-t border-[var(--paper-line)] py-8 md:gap-10 md:py-10">
                <span className="shrink-0 text-transparent" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, WebkitTextStroke: '1px rgba(10,18,32,0.25)' }}>{service.number}</span>
                <div className="pt-2">
                  <h3 className="type-h3 text-[var(--paper-text)]">{service.name}</h3>
                  <p className="type-body mt-2 !text-[var(--paper-text-2)]">{service.description}</p>
                  <PriceLine>{service.price}</PriceLine>
                </div>
              </article>
            </FadeIn>
          ))}
          <div className="border-t border-[var(--paper-line)]" />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {continuingServices.map((service, index) => (
            <FadeIn key={service.name} delay={index * 0.08}>
              <article className="h-full rounded-[20px] border border-[var(--paper-line)] p-6">
                <h3 className="type-h3 text-[var(--paper-text)]">{service.name}</h3>
                <p className="type-body mt-2 !text-[var(--paper-text-2)]">{service.description}</p>
                <PriceLine>{service.price}</PriceLine>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
