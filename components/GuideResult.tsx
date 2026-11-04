import Link from 'next/link'
import type { RefObject } from 'react'

export type GuideResultService = { name: string; capsule: string; priceLabel: string; href: string }
export type GuideResultIndustry = { name: string; href: string }

export type GuideResultCopy = {
  kicker: string
  title: string
  lead: string
  priceLabel: string
  industryLabel: string
  whatsappLabel: string
  restart: string
  restartHref: string
}

export type GuideResultProps = {
  services: GuideResultService[]
  industry: GuideResultIndustry | null
  whatsappHref: string
  copy: GuideResultCopy
  headingRef?: RefObject<HTMLHeadingElement | null>
}

/**
 * The guide's result screen. Purely props-driven so the server (no-JS submit)
 * and the client flow render the same thing; prices come from the services'
 * existing priceLabel, never invented here.
 */
export default function GuideResult({ services, industry, whatsappHref, copy, headingRef }: GuideResultProps) {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="mono-label text-[var(--accent)]">{copy.kicker}</p>
        <h2 ref={headingRef} tabIndex={-1} className="type-h2 mt-3 text-balance focus-visible:outline-none">
          {copy.title}
        </h2>
        <p className="mt-3 max-w-md leading-relaxed text-[var(--fg-2)]">{copy.lead}</p>
      </div>

      <ul className="flex flex-col">
        {services.map((service) => (
          <li key={service.href} className="border-t border-[var(--hairline)] last:border-b">
            <Link href={service.href} className="group flex flex-col gap-3 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
              <span className="min-w-0">
                <span className="big-row-name block">{service.name}</span>
                <span className="mt-2 block max-w-md text-sm leading-relaxed text-[var(--fg-2)]">{service.capsule}</span>
              </span>
              <span className="shrink-0 sm:text-right">
                <span className="mono-label block text-[var(--fg-3)]">{copy.priceLabel}</span>
                <span className="mt-1 block font-sans font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                  {service.priceLabel}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {industry ? (
        <p className="text-[var(--fg-2)]">
          {copy.industryLabel}{' '}
          <Link
            href={industry.href}
            className="font-semibold text-[var(--ink)] underline decoration-[var(--brass)] underline-offset-4 transition-colors hover:text-[var(--accent)]"
          >
            {industry.name} <span aria-hidden="true">→</span>
          </Link>
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-6">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[var(--brass-lite)] px-6 py-3.5 font-sans text-sm font-bold text-[var(--night)] transition-colors hover:bg-[#faf7f2]"
          style={{ borderRadius: 'var(--radius-pill)' }}
        >
          {copy.whatsappLabel} <span aria-hidden="true">→</span>
        </a>
        <Link
          href={copy.restartHref}
          className="font-sans text-sm font-semibold text-[var(--fg-2)] underline underline-offset-4 transition-colors hover:text-[var(--ink)]"
        >
          {copy.restart}
        </Link>
      </div>
    </div>
  )
}
