'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import TrackedLink from '@/components/TrackedLink'
import { useHref, useUi } from '@/lib/i18n/context'
import { whatsappUrl } from '@/lib/site'
import { Kicker, Reveal, SplitHeading } from './Reveal'

/**
 * Services as a large typographic index on cream. One row is open at a time;
 * the open row shows the pitch, the price and both ways to act on it.
 */
export default function ServicesIndex() {
  const href = useHref()
  const { services, redesign } = useUi()
  const copy = redesign.services
  const [open, setOpen] = useState<string | null>(services.items[0]?.id ?? null)
  const reduced = useReducedMotion()

  return (
    <section id="servicii" aria-labelledby="servicii-titlu" className="tone-cream relative py-28 md:py-40">
      <div className="studio-container">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr] md:items-end">
          <div>
            <Kicker index="02" label={copy.kicker} className="text-[var(--fg-3)]" />
            <div id="servicii-titlu" className="mt-6">
              <SplitHeading text={copy.title} className="display-xl text-[clamp(3rem,7.4vw,7.5rem)]" accentClassName="" />
            </div>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-md text-lg leading-relaxed text-[var(--fg-2)] md:justify-self-end">{copy.intro}</p>
          </Reveal>
        </div>

        <ul className="mt-20 border-t border-[var(--line)]">
          {services.items.map((service, index) => {
            const isOpen = open === service.id
            return (
              <li key={service.id} className="border-b border-[var(--line)]">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`serviciu-${service.id}`}
                    onClick={() => setOpen(isOpen ? null : service.id)}
                    className="group grid w-full cursor-pointer grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-7 text-left md:grid-cols-[5rem_1fr_auto] md:py-9"
                  >
                    <span className="mono-label text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
                    <span
                      className={`display-xl text-[clamp(2rem,5.4vw,5rem)] transition-[transform,color] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:translate-x-3 ${
                        isOpen ? 'display-italic text-[var(--brass-ink)]' : ''
                      }`}
                    >
                      {service.name}
                    </span>
                    <span className="flex items-center gap-4">
                      <span className={`mono-label hidden text-[var(--fg-3)] transition-opacity duration-300 md:inline ${isOpen ? 'opacity-0' : ''}`}>
                        {service.price}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`grid size-10 place-items-center rounded-full border border-[var(--line)] text-lg transition-transform duration-500 group-hover:border-[var(--ink)] ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                      >
                        +
                      </span>
                    </span>
                  </button>
                </h3>
                {/* Panels stay in the DOM while collapsed, so every service is crawlable. */}
                <motion.div
                  id={`serviciu-${service.id}`}
                  inert={!isOpen}
                  initial={false}
                  animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                  transition={{
                    duration: reduced ? 0 : 0.55,
                    ease: [0.2, 0.7, 0.2, 1],
                  }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-y-8 pb-10 md:grid-cols-[5rem_1fr_1fr] md:gap-x-4 md:pb-14">
                    <span aria-hidden="true" className="hidden md:block" />
                    <p className="max-w-xl text-lg leading-relaxed text-[var(--fg-2)]">{service.description}</p>
                    <div className="flex flex-col gap-5 md:items-end">
                      <p className="md:text-right">
                        <span className="display-xl block text-[clamp(1.8rem,2.6vw,2.6rem)]">{service.price}</span>
                        <span className="mono-label mt-2 block text-[var(--fg-3)]">{service.guarantee}</span>
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={href(`/servicii/${service.id}`)}
                          className="mono-label items-center rounded-[var(--radius-pill)] border border-[var(--ink)] px-6 transition-colors hover:bg-[var(--ink)] hover:text-[var(--shell)]"
                        >
                          {services.details} →
                        </Link>
                        <TrackedLink
                          href={whatsappUrl(service.message)}
                          target="_blank"
                          rel="noopener noreferrer"
                          eventName="service_whatsapp_click"
                          eventProperties={{ service: service.name }}
                          className="mono-label items-center rounded-[var(--radius-pill)] bg-[var(--ink)] px-6 text-[var(--shell)] transition-colors hover:bg-[var(--navy-2)]"
                        >
                          {services.offer}
                        </TrackedLink>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </li>
            )
          })}
        </ul>

        <div className="mt-24 grid gap-6 md:grid-cols-[1fr_2fr]">
          <Kicker label={copy.more} className="text-[var(--fg-3)]" />
          <div className="grid gap-6 sm:grid-cols-2">
            {services.continuing.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.08}>
                <article className="flex h-full flex-col rounded-[6px] border border-[var(--line)] p-7 transition-colors hover:border-[var(--ink)]">
                  <h3 className="display-xl text-3xl">{service.name}</h3>
                  <p className="mt-4 flex-1 leading-relaxed text-[var(--fg-2)]">{service.description}</p>
                  <p className="mono-label mt-6 text-[var(--accent)]">{service.price}</p>
                  <div className="mt-4 flex flex-wrap gap-x-6">
                    <Link href={href(`/servicii/${service.id}`)} className="font-semibold underline-offset-4 hover:underline">
                      {services.details} →
                    </Link>
                    <TrackedLink
                      href={whatsappUrl(service.message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      eventName="service_whatsapp_click"
                      eventProperties={{ service: service.name }}
                      className="font-semibold text-[var(--brass-ink)] underline-offset-4 hover:underline"
                    >
                      {services.offer}
                    </TrackedLink>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
