'use client'

import FadeIn from './FadeIn'
import ChartKicker from './ChartKicker'
import { useUi } from '@/lib/i18n/context'

export default function ProcessSection() {
  const copy = useUi().process
  return (
    <>
    <section id="process" className="scene-section">
      <div className="porthole scene-panel" style={{ maxWidth: '860px' }}>
        <FadeIn>
          <ChartKicker label={copy.kicker} />
          <h2 className="type-h2 text-balance">{copy.title}</h2>
        </FadeIn>
        <div className="mt-9 grid gap-8 md:grid-cols-3">
          {copy.steps.map((step, index) => (
            <FadeIn key={step.number} delay={index * 0.08}>
              <article>
                <span
                  aria-hidden="true"
                  className="block font-display leading-none"
                  style={{ fontSize: '44px', fontWeight: 600, color: 'rgba(26,23,20,0.14)' }}
                >
                  {step.number}
                </span>
                <h3 className="type-h3 mt-3">{step.title}</h3>
                <p className="type-body mt-3 text-[0.95rem]">{step.description}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
    {/* Breathing room before the FAQ. */}
    <div aria-hidden="true" style={{ height: '40vh' }} />
    </>
  )
}
