'use client'

import Link from 'next/link'
import { primaryButtonClass } from '@/components/form-styles'
import { CONTEST_PATH, PRIZE_VALUE_EUR } from '@/lib/contest/config'
import { useHref, useUi } from '@/lib/i18n/context'

/**
 * Invitation to the monthly free-site contest on the homepage. It sits after
 * the scroll scenes, outside the animated area.
 */
export default function ContestTeaser() {
  const href = useHref()
  const copy = useUi().contestTeaser
  return (
    <section aria-labelledby="site-gratuit-titlu" className="border-t border-[var(--hairline)] bg-[var(--shell)]">
      <div className="site-container py-16 md:py-24">
        <div className="porthole mx-auto flex max-w-[940px] flex-col gap-8 p-7 md:flex-row md:items-center md:justify-between md:p-12">
          <div className="max-w-xl">
            <p className="kicker">{copy.kicker}</p>
            <h2 id="site-gratuit-titlu" className="type-h3 mt-3 text-balance">
              {copy.title}
            </h2>
            <p className="type-body mt-4 text-[15px]">{copy.body.replace('{prize}', String(PRIZE_VALUE_EUR))}</p>
          </div>
          <Link href={href(CONTEST_PATH)} className={`${primaryButtonClass} shrink-0`}>
            {copy.cta}
          </Link>
        </div>
      </div>
    </section>
  )
}
