'use client'

import Link from 'next/link'
import TrackedLink from '@/components/TrackedLink'
import { useHref, useUi } from '@/lib/i18n/context'
import { whatsappUrl } from '@/lib/site'

/**
 * Services as a deck of cards that stack as you scroll: each one sticks a
 * little lower than the last, so the deck builds up while every price and
 * offer stays readable.
 */
export default function SalutServices() {
  const href = useHref()
  const { services, redesign } = useUi()
  const copy = redesign.salut

  return (
    <section id="servicii" aria-labelledby="salut-services" className="tone-dark salut-services relative pb-24 pt-28 md:pb-40 md:pt-40">
      <div className="studio-container">
        <h2 id="salut-services" className="salut-head display-xl">
          {copy.servicesTitle}
        </h2>
        <ol className="mt-14 md:mt-20">
          {services.items.map((service, index) => (
            <li key={service.id} className="salut-deck" style={{ top: `calc(clamp(5.5rem, 12svh, 7.5rem) + ${index * 1.4}rem)` }}>
              <article className="salut-deck-card tone-cream">
                <p className="salut-deck-n">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="salut-deck-name display-xl">{service.name}.</h3>
                <div className="salut-deck-foot">
                  <p className="max-w-xl text-lg leading-relaxed text-[var(--fg-2)]">{service.description}</p>
                  <div className="flex flex-col gap-5 md:items-end">
                    <p className="md:text-right">
                      <span className="display-xl block text-[clamp(2rem,3vw,3rem)]">{service.price}</span>
                      <span className="mono-label mt-2 block text-[var(--fg-3)]">{service.guarantee}</span>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={href(`/servicii/${service.id}`)}
                        className="inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--ink)] px-6 py-3 text-sm font-semibold transition-colors hover:bg-[var(--ink)] hover:text-[var(--shell)]"
                      >
                        {copy.details}
                      </Link>
                      <TrackedLink
                        href={whatsappUrl(service.message)}
                        target="_blank"
                        rel="noopener noreferrer"
                        eventName="service_whatsapp_click"
                        eventProperties={{ service: service.name }}
                        className="inline-flex items-center rounded-[var(--radius-pill)] bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-[var(--shell)] transition-colors hover:bg-[var(--navy-2)]"
                      >
                        {copy.offer}
                      </TrackedLink>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
