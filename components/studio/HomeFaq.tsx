'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { getWaUrl, useSegment } from '@/components/SegmentContext'
import { getHomeFaqGroups, getHomeFaqs } from '@/lib/home-faq'
import { useHref, useLocale, useUi } from '@/lib/i18n/context'
import { Kicker, SplitHeading } from './Reveal'

/** Same ids as before, so existing #anchors to questions keep working. */
function slugifyQuestion(question: string) {
  return question
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function HomeFaq() {
  const { segment } = useSegment()
  const locale = useLocale()
  const href = useHref()
  const copy = useUi().faq
  const faqs = getHomeFaqs(locale)
  const groups = getHomeFaqGroups(locale)
  const [open, setOpen] = useState<number | null>(null)
  const reduced = useReducedMotion()

  return (
    <section id="faq" aria-labelledby="faq-titlu" className="tone-warm relative py-28 md:py-40">
      <div className="studio-container grid gap-16 md:grid-cols-[1fr_1.6fr]">
        <div className="md:sticky md:top-32 md:self-start">
          <Kicker index="06" label={copy.kicker} className="text-[var(--fg-3)]" />
          <div id="faq-titlu" className="mt-6">
            <SplitHeading text={copy.title} className="display-xl text-[clamp(2.6rem,5vw,5rem)]" />
          </div>
          <p className="mt-8 max-w-sm leading-relaxed text-[var(--fg-2)]">
            {copy.more}{' '}
            <a
              href={getWaUrl(segment, undefined, locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline min-h-0 font-semibold text-[var(--brass-ink)] underline underline-offset-4"
            >
              {copy.write}
            </a>{' '}
            {copy.orRead}{' '}
            <Link href={href('/blog')} className="inline min-h-0 font-semibold text-[var(--brass-ink)] underline underline-offset-4">
              {copy.guides}
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-14">
          {groups.map((group) => (
            <div key={group.kicker}>
              <p className="mono-label mb-3 text-[var(--accent)]">{group.kicker}</p>
              <div className="border-t border-[var(--line)]">
                {group.indices.map((index) => {
                  const [question, answer] = faqs[index]
                  const id = slugifyQuestion(question)
                  const isOpen = open === index
                  return (
                    <article key={question} id={id} className="scroll-mt-28 border-b border-[var(--line)]">
                      <h3>
                        <button
                          type="button"
                          id={`${id}-intrebare`}
                          aria-expanded={isOpen}
                          aria-controls={`${id}-raspuns`}
                          onClick={() => setOpen(isOpen ? null : index)}
                          className="group flex min-h-[52px] w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
                        >
                          <span className="font-display text-xl leading-snug transition-transform duration-500 group-hover:translate-x-2 md:text-2xl">
                            {question}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`grid size-9 shrink-0 place-items-center rounded-full border border-[var(--line)] transition-transform duration-500 ${
                              isOpen ? 'rotate-45 border-[var(--ink)]' : ''
                            }`}
                          >
                            +
                          </span>
                        </button>
                      </h3>
                      {/* Answers stay in the DOM so they match the FAQPage structured data. */}
                      <motion.div
                        id={`${id}-raspuns`}
                        role="region"
                        aria-labelledby={`${id}-intrebare`}
                        inert={!isOpen}
                        initial={false}
                        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-7 leading-relaxed text-[var(--fg-2)]">{answer}</p>
                      </motion.div>
                    </article>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
