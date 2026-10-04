'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import FadeIn from './FadeIn'
import ChartKicker from './ChartKicker'
import TrackedLink from './TrackedLink'
import { getWaUrl, useSegment } from './SegmentContext'
import { useHref, useLocale, useUi } from '@/lib/i18n/context'

const cardClass =
  'group flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--shell)]/60 p-6 transition-[transform,border-color,box-shadow] duration-[250ms] ease-out hover:-translate-y-[3px] hover:border-[var(--brass)] hover:shadow-[0_18px_44px_rgba(26,23,20,0.10)] focus-visible:-translate-y-[3px] focus-visible:border-[var(--brass)] focus-visible:shadow-[0_18px_44px_rgba(26,23,20,0.10)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] md:p-7'

function PriceLine({ children }: { children: string }) {
  return <p className="mt-4 font-sans text-sm font-bold text-[var(--brass-ink)]">{children}</p>
}

function OfferAffordance({ label }: { label: string }) {
  return (
    <span className="mt-6 flex items-center gap-2">
      <span className="kicker">{label}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="h-4 w-4 text-[var(--brass)] transition-transform duration-[250ms] ease-out group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
      />
    </span>
  )
}

export default function ServicesSection() {
  const { segment } = useSegment()
  const locale = useLocale()
  const href = useHref()
  const copy = useUi().services
  const recommendedName = segment ? copy.recommend[segment] : null

  return (
    <section id="servicii" className="scene-section">
      <div className="porthole scene-panel">
        <FadeIn>
          <ChartKicker label={copy.kicker} />
          <h2 className="type-h2 text-balance">{copy.title}</h2>
          <p className="type-body mt-4">{copy.intro}</p>
        </FadeIn>

        <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-2">
          {copy.items.map((service, index) => {
            const recommended = recommendedName === service.name
            return (
              <FadeIn key={service.id} delay={index * 0.06} className="h-full">
                <div className={`${cardClass} ${recommended ? '!border-[var(--brass)] shadow-[0_18px_44px_rgba(26,23,20,0.10)]' : ''}`}>
                  <span className={`mb-4 w-fit rounded-[var(--radius-pill)] border border-[var(--brass)] px-3 py-1 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--brass-ink)] ${recommended ? '' : 'invisible'}`}>
                    {copy.recommended}
                  </span>
                  <h3 className="type-h3">{service.name}</h3>
                  <p className="type-body mt-2 text-[0.95rem]">{service.description}</p>
                  <PriceLine>{service.price}</PriceLine>
                  <p className="mt-2 font-sans text-[12.5px] text-[var(--ink-3)]">{service.guarantee}</p>
                  <span className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <TrackedLink
                      href={getWaUrl(null, service.message, locale)}
                      eventName="service_whatsapp_click"
                      eventProperties={{ service: service.name }}
                      target="_blank"
                      rel="noopener"
                      aria-label={`${copy.whatsappFor} ${service.name}`}
                      className="group/cta"
                    >
                      <OfferAffordance label={copy.offer} />
                    </TrackedLink>
                    <Link
                      href={href(`/servicii/${service.id}`)}
                      className="font-sans text-[12px] font-medium text-[var(--ink-2)] underline decoration-[var(--hairline)] underline-offset-4 transition-colors hover:text-[var(--brass-ink)] hover:decoration-[var(--brass)]"
                    >
                      {copy.details}<span className="sr-only"> {copy.detailsFor} {service.name}</span> →
                    </Link>
                  </span>
                </div>
              </FadeIn>
            )
          })}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {copy.continuing.map((service, index) => (
            <FadeIn key={service.id} delay={index * 0.06} className="h-full">
              <div className={cardClass}>
                <h3 className="type-h3">{service.name}</h3>
                <p className="type-body mt-2 text-[0.95rem]">{service.description}</p>
                <PriceLine>{service.price}</PriceLine>
                <span className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <TrackedLink
                    href={getWaUrl(null, service.message, locale)}
                    eventName="service_whatsapp_click"
                    eventProperties={{ service: service.name }}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${copy.whatsappFor} ${service.name}`}
                    className="group/cta"
                  >
                    <OfferAffordance label={copy.offer} />
                  </TrackedLink>
                  <Link
                    href={href(`/servicii/${service.id}`)}
                    className="font-sans text-[12px] font-medium text-[var(--ink-2)] underline decoration-[var(--hairline)] underline-offset-4 transition-colors hover:text-[var(--brass-ink)] hover:decoration-[var(--brass)]"
                  >
                    {copy.details}<span className="sr-only"> {copy.detailsFor} {service.name}</span> →
                  </Link>
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
