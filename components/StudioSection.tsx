'use client'

import { motion, useReducedMotion } from 'framer-motion'
import ChartKicker from './ChartKicker'
import { PHONE_DISPLAY, PHONE_HREF, EMAIL, EMAIL_HREF } from './SegmentContext'
import { useUi } from '@/lib/i18n/context'

const EASE = [0.22, 1, 0.36, 1] as const

export default function StudioSection() {
  const copy = useUi().studio
  const reduceMotion = useReducedMotion()
  const riseY = reduceMotion ? 0 : 18
  const duration = reduceMotion ? 0 : 0.7

  return (
    <section id="studio" className="scene-section">
      <div className="porthole scene-panel" style={{ maxWidth: '940px', marginInline: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: riseY }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration, ease: EASE }}
        >
          <ChartKicker label={copy.kicker} />
          <h2 className="type-h2 text-balance">{copy.title}</h2>
          <p className="type-body mt-6 max-w-[60ch]">{copy.intro}</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {copy.principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: riseY }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration, delay: reduceMotion ? 0 : index * 0.09, ease: EASE }}
            >
              <h3 className="type-h3">{principle.title}</h3>
              <p className="type-body mt-2 text-[15px]">{principle.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: riseY }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration, ease: EASE }}
          className="type-body mt-10 text-[15px] font-medium text-[var(--ink)]"
          style={{
            background: 'var(--shell-warm)',
            borderLeft: '3px solid var(--brass)',
            borderRadius: 'var(--radius-card)',
            padding: '20px 24px',
          }}
        >
          <span className="kicker mb-2 block">{copy.resultsKicker}</span>
          {copy.results}
        </motion.div>

        <p className="mt-7 border-t border-[var(--hairline)] pt-7 text-center text-[14px] text-[var(--ink-2)]">
          {copy.sameRules}{' '}
          <a
            href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmaststudio.ro"
            target="_blank"
            rel="noopener"
            className="text-[var(--brass-ink)] underline-offset-4 hover:underline"
          >
            {copy.speed}
          </a>
        </p>

        <p className="mt-7 text-center text-sm text-[var(--ink-2)]">
          {copy.direct}{' '}
          <a href={PHONE_HREF} className="transition-colors hover:text-[var(--brass)]">{PHONE_DISPLAY}</a>
          {' · '}
          <a href={EMAIL_HREF} className="transition-colors hover:text-[var(--brass)]">{EMAIL}</a>
        </p>
      </div>
    </section>
  )
}
