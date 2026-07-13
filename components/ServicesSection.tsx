'use client'

import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import FadeIn from './FadeIn'
import ChartKicker from './ChartKicker'
import TrackedLink from './TrackedLink'

const services = [
  { cardinal: 'N', direction: 0, name: 'Site de prezentare', description: 'Vitrina digitală a afacerii tale: design unic, copy care convinge și PageSpeed 90+ la predare.', price: 'de la 300 EUR · live în 48h de la primirea conținutului', message: 'Salut! Vreau un site de prezentare, livrat în 48 de ore. Îmi poți face o ofertă?' },
  { cardinal: 'E', direction: 90, name: 'Magazin online', description: 'eCommerce care convertește: catalog, plăți, comenzi și integrare facturare, fără fricțiune.', price: 'de la 900 EUR · live în 7 zile', message: 'Salut! Vreau un magazin online. Îmi poți face o ofertă?' },
  { cardinal: 'S', direction: 180, name: 'Web & Mobile App', description: 'Aplicații web și mobile pentru operațiuni interne sau experiențe dedicate clienților tăi.', price: 'ofertă personalizată', message: 'Salut! Am nevoie de o aplicație web sau mobilă. Putem discuta?' },
  { cardinal: 'V', direction: 270, name: 'Platforme personalizate (SaaS)', description: 'Produse digitale complete: conturi, abonamente, dashboards și automatizări.', price: 'ofertă personalizată', message: 'Salut! Vreau să construim o platformă personalizată. Putem discuta?' },
]

const continuingServices = [
  { name: 'Mentenanță & creștere', description: 'Administrare, actualizări, SEO continuu și optimizări lunare.', price: 'de la 90 EUR/lună', message: 'Salut! Mă interesează mentenanță și creștere pentru site-ul meu.' },
  { name: 'Automatizări & AI', description: 'Chatbot, preluare clienți pe WhatsApp și fluxuri automate care elimină munca repetitivă.', price: 'de la 250 EUR', message: 'Salut! Mă interesează automatizări și AI pentru afacerea mea.' },
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

function OfferAffordance() {
  return (
    <span className="mt-6 flex items-center justify-end gap-2">
      <ArrowUpRight aria-hidden="true" className="h-[18px] w-[18px] text-[var(--gold)] transition-transform duration-[250ms] ease-out group-hover:-translate-y-[3px] group-hover:translate-x-[3px] group-focus-visible:-translate-y-[3px] group-focus-visible:translate-x-[3px]" />
      <span className="type-kicker !text-[rgba(10,18,32,0.45)] transition-colors duration-[250ms] ease-out group-hover:!text-[rgba(10,18,32,0.75)] group-focus-visible:!text-[rgba(10,18,32,0.75)]">Cere ofertă</span>
    </span>
  )
}

function whatsappUrl(message: string) {
  return `https://wa.me/40755928029?text=${encodeURIComponent(message)}`
}

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  const controls = useAnimationControls()
  const reduceMotion = useReducedMotion()
  const pointTo = (degrees: number) => {
    if (reduceMotion) return
    controls.start({ rotate: degrees, transition: { type: 'spring', stiffness: 60, damping: 9 } })
  }

  return (
    <motion.a
      href={whatsappUrl(service.message)}
      onClick={() => import('@vercel/analytics').then(({ track }) => track('service_whatsapp_click', { service: service.name })).catch(() => undefined)}
      target="_blank"
      rel="noopener"
      aria-label={`Cere ofertă pe WhatsApp pentru ${service.name}`}
      className="group flex min-h-72 flex-col rounded-[20px] border border-[var(--paper-line)] bg-[rgba(255,255,255,0.35)] p-7 transition-[border-color,box-shadow] duration-[250ms] ease-out hover:border-[var(--gold-soft)] hover:shadow-[0_12px_32px_rgba(10,18,32,0.10)] focus-visible:-translate-y-1 focus-visible:border-[var(--gold-soft)] focus-visible:shadow-[0_12px_32px_rgba(10,18,32,0.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold-soft)] md:p-8"
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onHoverStart={() => pointTo(service.direction)}
      onHoverEnd={() => pointTo(0)}
      onFocus={() => pointTo(service.direction)}
      onBlur={() => pointTo(0)}
    >
      <div className="flex items-start justify-between">
        <CompassRose direction={service.direction} controls={controls} reduceMotion={Boolean(reduceMotion)} />
        <span className="type-kicker !text-[rgba(10,18,32,0.35)]">{service.cardinal}</span>
      </div>
      <div className="mt-auto pt-10">
        <h3 className="type-h3 text-[var(--paper-text)]">{service.name}</h3>
        <p className="type-body mt-2 !text-[var(--paper-text-2)]">{service.description}</p>
        <PriceLine>{service.price}</PriceLine>
        <OfferAffordance />
      </div>
    </motion.a>
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
            <ChartKicker bearing="05" label="Servicii" paper />
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
              <TrackedLink
                href={whatsappUrl(service.message)}
                eventName="service_whatsapp_click"
                eventProperties={{ service: service.name }}
                target="_blank"
                rel="noopener"
                aria-label={`Cere ofertă pe WhatsApp pentru ${service.name}`}
                className="group flex h-full flex-col rounded-[20px] border border-[var(--paper-line)] p-6 transition-[transform,border-color,box-shadow] duration-[250ms] ease-out hover:-translate-y-1 hover:border-[var(--gold-soft)] hover:shadow-[0_12px_32px_rgba(10,18,32,0.10)] focus-visible:-translate-y-1 focus-visible:border-[var(--gold-soft)] focus-visible:shadow-[0_12px_32px_rgba(10,18,32,0.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold-soft)]"
              >
                <h3 className="type-h3 text-[var(--paper-text)]">{service.name}</h3>
                <p className="type-body mt-2 !text-[var(--paper-text-2)]">{service.description}</p>
                <PriceLine>{service.price}</PriceLine>
                <div className="mt-auto pt-4"><OfferAffordance /></div>
              </TrackedLink>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
