'use client'

import Link from 'next/link'
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useHref, useUi } from '@/lib/i18n/context'
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF } from '@/lib/site'
import { Kicker, Reveal, SplitHeading } from './Reveal'

/** Counts up to `to` the first time it is seen (written to the DOM, no re-renders). */
function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.6 })
  const reduced = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!seen || !el || reduced) return
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (latest) => {
        el.textContent = `${prefix}${Math.round(latest)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [seen, reduced, to, prefix, suffix])
  return (
    <span ref={ref}>
      {prefix}
      {to}
      {suffix}
    </span>
  )
}

/** Studio principles, the measured result, and the three-step process. */
export default function StudioProcess() {
  const href = useHref()
  const { studio, process, redesign } = useUi()
  const stepsRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ['start 80%', 'end 60%'] })
  const line = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="studio" aria-labelledby="studio-titlu" className="tone-dark grain relative overflow-hidden py-28 md:py-40">
      <div className="studio-container relative">
        <div className="grid gap-16 md:grid-cols-[1fr_1.15fr]">
          <div className="md:sticky md:top-32 md:self-start">
            <Kicker index="04" label={studio.kicker} className="text-[var(--fg-3)]" />
            <div id="studio-titlu" className="mt-6">
              <SplitHeading text={studio.title} className="display-xl text-[clamp(2.6rem,5vw,5rem)]" />
            </div>
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-[var(--fg-2)]">{studio.intro}</p>
            </Reveal>
          </div>

          <ol className="flex flex-col">
            {studio.principles.map((principle, index) => (
              <li key={principle.title} className="border-t border-[var(--line)] py-10 first:border-t-0 first:pt-0 md:first:pt-2">
                <Reveal delay={0.05}>
                  <p className="mono-label text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="display-xl mt-4 text-[clamp(1.8rem,2.6vw,2.6rem)]">{principle.title}</h3>
                  <p className="mt-4 max-w-xl leading-relaxed text-[var(--fg-2)]">{principle.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <Link
          href={href('/portofoliu/veterinaria-timisoara')}
          className="link-block group mt-28 grid gap-8 border-y border-[var(--line)] py-14 md:grid-cols-[auto_1fr] md:items-center md:gap-16 md:py-20"
        >
          <span className="display-xl text-[clamp(6rem,18vw,16rem)] leading-[0.8] text-[var(--brass-lite)]">
            <CountUp to={80} prefix="+" suffix="%" />
          </span>
          <span className="flex flex-col gap-5">
            <span className="mono-label text-[var(--fg-3)]">{redesign.studio.resultLabel}</span>
            <span className="max-w-xl text-xl leading-relaxed md:text-2xl">{studio.results}</span>
            <span className="mono-label text-[var(--fg-2)] transition-colors group-hover:text-[var(--brass-lite)]">
              {redesign.work.view} →
            </span>
          </span>
        </Link>

        <div id="proces" ref={stepsRef} className="mt-28 scroll-mt-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Kicker index="05" label={redesign.studio.processKicker} className="text-[var(--fg-3)]" />
              <SplitHeading text={process.title} className="display-xl mt-6 text-[clamp(2.4rem,4.6vw,4.6rem)]" />
            </div>
          </div>
          <div className="relative mt-16">
            <div aria-hidden="true" className="absolute left-0 right-0 top-[1.15rem] hidden h-px bg-[var(--line)] md:block">
              <motion.div className="h-px origin-left bg-[var(--brass-lite)]" style={{ scaleX: line }} />
            </div>
            <ol className="grid gap-12 md:grid-cols-3 md:gap-10">
              {process.steps.map((step, index) => (
                <li key={step.number} className="relative">
                  <Reveal delay={index * 0.12}>
                    <span className="relative z-10 grid size-9 place-items-center rounded-full border border-[var(--brass-lite)] bg-[var(--night)] font-mono text-xs text-[var(--brass-lite)]">
                      {step.number}
                    </span>
                    <h3 className="display-xl mt-8 text-[clamp(1.8rem,2.4vw,2.4rem)]">{step.title}</h3>
                    <p className="mt-4 max-w-sm leading-relaxed text-[var(--fg-2)]">{step.description}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-4 border-t border-[var(--line)] pt-10 text-[var(--fg-2)] md:flex-row md:items-center md:justify-between">
          <p>
            {studio.sameRules}{' '}
            <a
              href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmaststudio.ro"
              target="_blank"
              rel="noopener"
              className="text-[var(--brass-lite)] underline-offset-4 hover:underline"
            >
              {studio.speed}
            </a>
          </p>
          <p>
            {studio.direct}{' '}
            <a href={PHONE_HREF} className="text-[var(--fg)] transition-colors hover:text-[var(--brass-lite)]">
              {PHONE_DISPLAY}
            </a>
            {' · '}
            <a href={EMAIL_HREF} className="text-[var(--fg)] transition-colors hover:text-[var(--brass-lite)]">
              {EMAIL}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
