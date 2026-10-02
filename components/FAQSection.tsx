'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { homeFaqGroups, homeFaqs } from '@/lib/home-faq'
import FadeIn from './FadeIn'
import ChartKicker from './ChartKicker'
import { getWaUrl, useSegment } from './SegmentContext'

function slugifyQuestion(question: string) {
  return question
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  delay,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  delay: number
}) {
  const id = slugifyQuestion(question)
  return (
    <FadeIn delay={delay}>
      <article id={id} className="border-b border-[var(--hairline)] last:border-b-0">
        <h3>
          <button
            type="button"
            id={`${id}-intrebare`}
            className="flex min-h-[52px] w-full cursor-pointer items-center justify-between gap-6 py-5 text-left"
            aria-expanded={isOpen}
            aria-controls={`${id}-raspuns`}
            onClick={onToggle}
          >
            <span className="type-h3">{question}</span>
            <Plus
              className={`shrink-0 text-[var(--brass)] transition-transform duration-[250ms] ${isOpen ? 'rotate-45' : ''}`}
              size={20}
              aria-hidden="true"
            />
          </button>
        </h3>
        {/* The answer stays in the DOM while collapsed, so it is readable by search
            engines and matches the FAQPage structured data. */}
        <motion.div
          id={`${id}-raspuns`}
          role="region"
          aria-labelledby={`${id}-intrebare`}
          inert={!isOpen}
          initial={false}
          animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <p className="type-body pb-6 text-[0.95rem]">{answer}</p>
        </motion.div>
      </article>
    </FadeIn>
  )
}

export default function FAQSection() {
  const { segment } = useSegment()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="scene-section">
      <div className="porthole scene-panel" style={{ maxWidth: '900px' }}>
        <FadeIn>
          <ChartKicker label="Înainte de îmbarcare" />
          <h2 className="type-h2 text-balance">Întrebări frecvente.</h2>
        </FadeIn>
        {homeFaqGroups.map((group) => (
          <div key={group.kicker} className="mt-10 first-of-type:mt-8">
            <FadeIn>
              <p className="kicker mb-2">{group.kicker}</p>
            </FadeIn>
            {group.indices.map((index, positionInGroup) => {
              const [question, answer] = homeFaqs[index]
              return (
                <FAQItem
                  key={question}
                  question={question}
                  answer={answer}
                  // openIndex holds a global index, so only one row is ever open
                  // across all three groups.
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
                  delay={Math.min(positionInGroup, 5) * 0.06}
                />
              )
            })}
          </div>
        ))}
        <p className="type-body mt-9">
          Altă întrebare? Răspundem în aceeași zi.{' '}
          <a
            href={getWaUrl(segment)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--brass-ink)] underline decoration-[var(--glass-edge)] underline-offset-4 transition-colors hover:text-[var(--ink)]"
          >
            Scrie-ne →
          </a>{' '}
          sau citește{' '}
          <Link
            href="/blog"
            className="font-semibold text-[var(--brass-ink)] underline decoration-[var(--glass-edge)] underline-offset-4 transition-colors hover:text-[var(--ink)]"
          >
            ghidurile despre prețuri și termene
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
