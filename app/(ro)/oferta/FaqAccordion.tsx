'use client'

import { useState } from 'react'

type FaqItem = {
  question: string
  answer: string
}

/** Plain accordion, no animation library: the ad page must stay light. */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="border-t border-[var(--hairline)]">
      {items.map((item, index) => {
        const isOpen = open === index
        const panelId = `oferta-faq-${index}`
        return (
          <article key={item.question} className="border-b border-[var(--hairline)]">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex min-h-[52px] w-full cursor-pointer items-center justify-between gap-6 py-5 text-left"
              >
                <span className="font-display text-xl leading-snug text-[var(--ink)]">{item.question}</span>
                <span
                  aria-hidden="true"
                  className={`grid size-9 shrink-0 place-items-center rounded-full border border-[var(--hairline)] text-[var(--ink)] transition-transform duration-300 ${
                    isOpen ? 'rotate-45 border-[var(--ink)]' : ''
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            {isOpen ? (
              <p id={panelId} className="max-w-2xl pb-6 leading-relaxed text-[var(--fg-2)]">
                {item.answer}
              </p>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}
