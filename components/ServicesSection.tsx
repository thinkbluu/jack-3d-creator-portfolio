'use client'

import FadeIn from './FadeIn'

const services = [
  {
    number: '01',
    name: 'Site de prezentare',
    description:
      'Vitrina digitală a afacerii tale: design unic, copy care convinge și PageSpeed 90+ la predare.',
    price: 'de la 300 EUR · live în 48h de la primirea conținutului',
  },
  {
    number: '02',
    name: 'Magazin online',
    description:
      'eCommerce care convertește: catalog, plăți, comenzi și integrare facturare, fără fricțiune și fără abandon de coș.',
    price: 'de la 900 EUR · live în 7 zile',
  },
  {
    number: '03',
    name: 'Web & Mobile App',
    description:
      'Aplicații web și mobile pentru operațiuni interne sau experiențe dedicate clienților tăi, de la concept la lansare.',
    price: 'ofertă personalizată',
  },
  {
    number: '04',
    name: 'Platforme personalizate (SaaS)',
    description:
      'Produse digitale complete: conturi, abonamente, dashboards și automatizări, construite pe operațiunea ta.',
    price: 'ofertă personalizată',
  },
]

const continuingServices = [
  {
    name: 'Mentenanță & creștere',
    description: 'Administrare, actualizări, SEO continuu și optimizări lunare.',
    price: 'de la 90 EUR/lună',
  },
  {
    name: 'Automatizări & AI',
    description:
      'Chatbot pe site, preluare clienți pe WhatsApp, integrare SmartBill/Oblio și e-Factura, fluxuri automate care îți scot orele repetitive din program.',
    price: 'de la 250 EUR',
  },
]

function PriceLine({ children }: { children: string }) {
  const [value, ...rest] = children.split(' · ')

  return (
    <p className="text-sm md:text-base font-medium text-[#050A14]/80">
      <span className="font-bold">{value}</span>
      {rest.length > 0 ? ` · ${rest.join(' · ')}` : null}
    </p>
  )
}

export default function ServicesSection() {
  return (
    <section
      id="price"
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: '#F5F1E8' }}
    >
      <h2
        className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ color: '#0C0C0C', fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Servicii
      </h2>

      <div className="max-w-5xl mx-auto">
        {services.map((service, i) => (
          <FadeIn key={service.number} delay={i * 0.1} y={20}>
            <div
              className="flex items-start gap-6 md:gap-10 py-8 sm:py-10 md:py-12"
              style={{ borderTop: '1px solid rgba(12, 12, 12, 0.15)' }}
            >
              <span
                className="font-black leading-none flex-shrink-0"
                style={{ color: '#0C0C0C', fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {service.number}
              </span>
              <div className="flex flex-col justify-center gap-2 pt-2">
                <p
                  className="font-medium uppercase"
                  style={{ color: '#0C0C0C', fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </p>
                <p
                  className="font-light leading-relaxed max-w-2xl"
                  style={{ color: '#0C0C0C', fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.6 }}
                >
                  {service.description}
                </p>
                <PriceLine>{service.price}</PriceLine>
              </div>
            </div>
          </FadeIn>
        ))}
        <div style={{ borderTop: '1px solid rgba(12, 12, 12, 0.15)' }} />

        <div className="mt-12 flex flex-col gap-4 md:flex-row">
          {continuingServices.map((service, i) => (
            <FadeIn key={service.name} delay={i * 0.1} y={20} className="flex-1">
              <div className="h-full rounded-2xl border border-[rgba(5,10,20,0.15)] bg-transparent p-6">
                <p className="text-base font-medium uppercase text-[#050A14]">{service.name}</p>
                <p className="mt-2 text-sm font-light leading-relaxed text-[#050A14] opacity-60">
                  {service.description}
                </p>
                <div className="mt-4">
                  <PriceLine>{service.price}</PriceLine>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
