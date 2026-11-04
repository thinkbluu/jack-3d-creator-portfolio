'use client'

import Link from 'next/link'

import { useHref, useLocale } from '@/lib/i18n/context'
import { checkerCopy } from '@/lib/checker/copy'

/**
 * The free website checker, as a quiet block on the homepage: one line of
 * proof-of-work between the questions and the sign-off.
 */
export default function CheckerBlock() {
  const href = useHref()
  const locale = useLocale()
  const copy = checkerCopy[locale].homeBlock
  return (
    <section aria-labelledby="checker-block-title" className="tone-dark py-[clamp(4rem,8vw,7rem)]">
      <div className="studio-container">
        <div className="grid gap-8 border-t border-[var(--hairline-dark)] pt-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 id="checker-block-title" className="type-h3 text-balance">
              {copy.title}
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-[var(--ink-2)]">{copy.text}</p>
          </div>
          <Link
            href={href('/verifica-site')}
            className="mono-label inline-flex items-center gap-2 whitespace-nowrap rounded-[var(--radius-pill)] border border-[var(--hairline-dark)] px-6 py-3 text-[var(--ink)] transition-colors hover:border-[var(--brass-lite)] hover:text-[var(--brass-lite)]"
          >
            {copy.link}
          </Link>
        </div>
      </div>
    </section>
  )
}
