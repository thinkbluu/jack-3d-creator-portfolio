import Link from 'next/link'
import { primaryButtonClass } from '@/components/form-styles'
import { CONTEST_PATH, PRIZE_VALUE_EUR } from '@/lib/contest/config'

/**
 * Invitation to the monthly free-site contest on the homepage. It sits after
 * the scroll scenes, outside the animated area, and is rendered on the server.
 */
export default function ContestTeaser() {
  return (
    <section aria-labelledby="site-gratuit-titlu" className="border-t border-[var(--hairline)] bg-[var(--shell)]">
      <div className="site-container py-16 md:py-24">
        <div className="porthole mx-auto flex max-w-[940px] flex-col gap-8 p-7 md:flex-row md:items-center md:justify-between md:p-12">
          <div className="max-w-xl">
            <p className="kicker">Concurs lunar · Site gratuit</p>
            <h2 id="site-gratuit-titlu" className="type-h3 mt-3 text-balance">
              Un site de prezentare gratuit, în fiecare lună
            </h2>
            <p className="type-body mt-4 text-[15px]">
              În fiecare lună construim gratuit un site de prezentare, în valoare de {PRIZE_VALUE_EUR} EUR, pentru o afacere mică din România. Te
              înscrii, postezi pe Instagram sau pe pagina de Facebook a afacerii și ne etichetezi. Postarea cu cele mai multe aprecieri câștigă.
            </p>
          </div>
          <Link href={CONTEST_PATH} className={`${primaryButtonClass} shrink-0`}>
            Vezi cum participi
          </Link>
        </div>
      </div>
    </section>
  )
}
