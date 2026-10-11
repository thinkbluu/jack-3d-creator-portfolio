'use client'

import type { ReactNode } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import type { BreadcrumbItem } from '@/lib/schema'
import { Kicker, Reveal, SplitHeading } from './Reveal'

/**
 * Opening block for inner pages: breadcrumbs, a mono kicker, a large display
 * title that rises word by word, and an intro. `tone` picks the surface; the
 * dark one carries film grain and a faint compass watermark.
 */
export default function PageHero({
  crumbs,
  kicker,
  title,
  accent,
  intro,
  tone = 'dark',
  children,
  aside,
}: {
  crumbs?: BreadcrumbItem[]
  kicker?: string
  title: string
  accent?: string
  intro?: ReactNode
  tone?: 'dark' | 'navy' | 'cream'
  children?: ReactNode
  aside?: ReactNode
}) {
  const dark = tone !== 'cream'
  return (
    <section className={`tone-${tone} ${dark ? 'grain' : ''} relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28`}>
      {dark ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[28vw] top-28 size-[80vw] max-w-[52rem] bg-[var(--navy-2)] opacity-60 md:-right-[12vw] md:-top-[8vw] md:size-[56vw]"
          style={{
            mask: "url('/icons/mast-mark.svg') center / contain no-repeat",
            WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat",
          }}
        />
      ) : null}
      <div className="studio-container relative">
        {crumbs ? <Breadcrumbs items={crumbs} /> : null}
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            {kicker ? <Kicker label={kicker} className="text-[var(--fg-3)]" /> : null}
            <SplitHeading
              as="h1"
              text={title}
              accent={accent}
              className="display-xl mt-6 text-balance text-[clamp(2.8rem,7.2vw,7rem)]"
              accentClassName="display-italic text-[var(--accent)]"
            />
          </div>
          {aside ? <Reveal delay={0.25}>{aside}</Reveal> : null}
        </div>
        {intro ? (
          <Reveal delay={0.2}>
            <div className="mt-10 max-w-2xl text-lg leading-relaxed text-[var(--fg-2)] md:text-xl">{intro}</div>
          </Reveal>
        ) : null}
        {children ? (
          <Reveal delay={0.3}>
            <div className="mt-10">{children}</div>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
