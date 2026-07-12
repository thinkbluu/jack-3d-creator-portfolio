'use client'

import FadeIn from './FadeIn'

const services = [
  {
    number: '01',
    name: 'Site de prezentare',
    description:
      'Vitrina digitală a afacerii tale: design unic, copy care convinge și PageSpeed 90+ la predare, livrat în 7 zile.',
  },
  {
    number: '02',
    name: 'Magazin online',
    description:
      'eCommerce care convertește: catalog, plăți, comenzi și integrare facturare, fără fricțiune și fără abandon de coș.',
  },
  {
    number: '03',
    name: 'Landing page',
    description:
      'O singură pagină, un singur obiectiv: campanii de ads care au unde să trimită traficul ca să îl transforme în cereri.',
  },
  {
    number: '04',
    name: 'Identitate vizuală',
    description:
      'Logo, culori, tipografie și un sistem coerent care face brandul recognoscibil pe orice canal.',
  },
  {
    number: '05',
    name: 'Mentenanță & creștere',
    description:
      'Administrare, actualizări, SEO continuu și optimizări lunare: site-ul rămâne rapid, sigur și vizibil.',
  },
]

export default function ServicesSection() {
  return (
    <section
      id="price"
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: '#F5F1E8' }}
    >
      <h2
        className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ color: '#050A14', fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Servicii
      </h2>

      <div className="max-w-5xl mx-auto">
        {services.map((service, i) => (
          <FadeIn key={service.number} delay={i * 0.1} y={20}>
            <div
              className="flex items-start gap-6 md:gap-10 py-8 sm:py-10 md:py-12"
              style={{ borderTop: '1px solid rgba(5, 10, 20, 0.15)' }}
            >
              <span
                className="font-black leading-none flex-shrink-0"
                style={{ color: '#050A14', fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {service.number}
              </span>
              <div className="flex flex-col justify-center gap-2 pt-2">
                <p
                  className="font-medium uppercase"
                  style={{ color: '#050A14', fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </p>
                <p
                  className="font-light leading-relaxed max-w-2xl"
                  style={{ color: '#050A14', fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.6 }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
        {/* Bottom border */}
        <div style={{ borderTop: '1px solid rgba(5, 10, 20, 0.15)' }} />
      </div>
    </section>
  )
}
