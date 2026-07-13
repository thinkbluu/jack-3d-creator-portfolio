'use client'

import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import type { CSSProperties } from 'react'
import FadeIn from './FadeIn'
import ChartKicker from './ChartKicker'

const services = [
  { cardinal: 'N', direction: 0, name: 'Site de prezentare', description: 'Vitrina digitală a afacerii tale: design unic, copy care convinge și PageSpeed 90+ la predare.', price: 'de la 300 EUR · live în 48h de la primirea conținutului' },
  { cardinal: 'E', direction: 90, name: 'Magazin online', description: 'eCommerce care convertește: catalog, plăți, comenzi și integrare facturare, fără fricțiune.', price: 'de la 900 EUR · live în 7 zile' },
  { cardinal: 'S', direction: 180, name: 'Web & Mobile App', description: 'Aplicații web și mobile pentru operațiuni interne sau experiențe dedicate clienților tăi.', price: 'ofertă personalizată' },
  { cardinal: 'V', direction: 270, name: 'Platforme personalizate (SaaS)', description: 'Produse digitale complete: conturi, abonamente, dashboards și automatizări.', price: 'ofertă personalizată' },
]

const continuingServices = [
  { name: 'Mentenanță & creștere', description: 'Administrare, actualizări, SEO continuu și optimizări lunare.', price: 'de la 90 EUR/lună' },
  { name: 'Automatizări & AI', description: 'Chatbot, preluare clienți pe WhatsApp și fluxuri automate care elimină munca repetitivă.', price: 'de la 250 EUR' },
]

function CompassRose({ direction, controls, reduceMotion }: { direction: number; controls: ReturnType<typeof useAnimationControls>; reduceMotion: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className="h-10 w-10 shrink-0 text-[var(--paper-text)]">
      <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeOpacity="0.38" strokeWidth="1" />
      <path d="M20 2.5v4M37.5 20h-4M20 37.5v-4M2.5 20h4" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeLinecap="round" strokeWidth="1" />
      <motion.g
        initial={{ rotate: reduceMotion ? direction : 0 }}
        animate={controls}
        className="origin-center [@media(pointer:coarse)]:![transform:rotate(var(--needle-direction))] motion-reduce:![transform:rotate(var(--needle-direction))]"
        style={{ '--needle-direction': `${direction}deg`, transformBox: 'view-box' } as CSSProperties}
      >
        <path d="M20 7.5 22.2 20 20 18.5 17.8 20Z" fill="var(--gold)" />
        <path d="M20 32.5 17.8 20 20 21.5 22.2 20Z" fill="currentColor" fillOpacity="0.32" />
      </motion.g>
      <circle cx="20" cy="20" r="1.5" fill="var(--paper-text)" />
    </svg>
  )
}

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  const controls = useAnimationControls()
  const reduceMotion = useReducedMotion()
  const pointTo = (degrees: number) => {
    if (reduceMotion) return
    controls.start({ rotate: degrees, transition: { type: 'spring', stiffness: 60, damping: 9 } })
  }

  return (
    <motion.article
      className="group flex min-h-72 flex-col rounded-[20px] border border-[var(--paper-line)] bg-[rgba(255,255,255,0.35)] p-7 transition-[border-color,box-shadow] duration-[250ms] ease-out hover:border-[var(--gold-soft)] hover:shadow-[0_12px_32px_rgba(10,18,32,0.10)] md:p-8"
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onHoverStart={() => pointTo(service.direction)}
      onHoverEnd={() => pointTo(0)}
    >
      <div className="flex items-start justify-between">
        <CompassRose direction={service.direction} controls={controls} reduceMotion={Boolean(reduceMotion)} />
        <span className="type-kicker !text-[rgba(10,18,32,0.35)]">{service.cardinal}</span>
      </div>
      <div className="mt-auto pt-10">
        <h3 className="type-h3 text-[var(--paper-text)]">{service.name}</h3>
        <p className="type-body mt-2 !text-[var(--paper-text-2)]">{service.description}</p>
        <PriceLine>{service.price}</PriceLine>
      </div>
    </motion.article>
  )
}

function PriceLine({ children }: { children: string }) {
  const [value, ...rest] = children.split(' · ')
  return <p className="mt-3 text-sm font-medium text-[var(--paper-text-2)]"><span className="font-bold text-[var(--gold)]">{value}</span>{rest.length ? ` · ${rest.join(' · ')}` : null}</p>
}

export default function ServicesSection() {
  return (
    <section id="services" className="section-shell rounded-t-[28px] bg-[var(--paper)] text-[var(--paper-text)]">
      <div className="site-container">
        <FadeIn>
          <header className="section-header">
            <ChartKicker bearing="04" label="Servicii" paper />
            <h2 className="type-h2 !text-[var(--paper-text)]">Patru direcții. Una e a ta.</h2>
            <p className="type-body mt-5 !text-[var(--paper-text-2)]">Soluții clare, construite în jurul obiectivelor tale de business.</p>
          </header>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <FadeIn key={service.cardinal} delay={index * 0.08} className="h-full">
              <ServiceCard service={service} />
            </FadeIn>
          ))}
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
