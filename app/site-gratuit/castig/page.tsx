import Link from 'next/link'
import ContestPrivatePage, { InvalidLink, Notice, privateMetadata } from '@/components/ContestPrivatePage'
import { checkboxClass, checkboxLabelClass, inputClass, labelClass, primaryButtonClass, textLinkClass } from '@/components/form-styles'
import { CLAIM_DAYS, RULES_PATH, isContestConfigured, roundLabel } from '@/lib/contest/config'
import { formatDeadline } from '@/lib/contest/emails'
import { getClaim } from '@/lib/contest/service'
import { verifyToken } from '@/lib/contest/tokens'

export const dynamic = 'force-dynamic'
export const metadata = privateMetadata('Confirmă premiul')

const messages: Record<string, string> = {
  'fara-acord': 'Ca să primești premiul, bifează acordul cu condițiile din regulament.',
  expired: `Termenul de ${CLAIM_DAYS} zile a trecut, așa că premiul a trecut la următoarea postare din clasament.`,
  'already-claimed': 'Premiul a fost deja confirmat.',
  invalid: 'Linkul nu mai e valabil.',
  eroare: 'Ceva nu a mers. Încearcă din nou peste câteva minute.',
}

type Props = { searchParams: Promise<{ t?: string; stare?: string }> }

export default async function ClaimPage({ searchParams }: Props) {
  const { t, stare } = await searchParams
  const entryId = isContestConfigured() ? verifyToken(t, 'claim') : null
  const claim = entryId ? await getClaim(entryId) : null

  if (!claim) {
    return (
      <ContestPrivatePage title="Confirmă premiul">
        <InvalidLink />
      </ContestPrivatePage>
    )
  }

  if (claim.claimed) {
    return (
      <ContestPrivatePage title="Am primit confirmarea">
        <Notice tone="success">
          Mulțumim, {claim.name.split(' ')[0]}! Am primit confirmarea și detaliile pentru {claim.businessName}. Te contactăm în cel mult 2 zile lucrătoare.
        </Notice>
      </ContestPrivatePage>
    )
  }

  if (claim.expired) {
    return (
      <ContestPrivatePage title="Termenul a expirat">
        <p className="type-body">{messages.expired}</p>
      </ContestPrivatePage>
    )
  }

  return (
    <ContestPrivatePage title={`Felicitări, ${claim.name.split(' ')[0]}!`}>
      {stare && messages[stare] ? <Notice>{messages[stare]}</Notice> : null}
      <p className="type-body">
        Postarea pentru {claim.businessName} a câștigat runda din {roundLabel(claim.round)}. Confirmă premiul
        {claim.deadline ? ` până pe ${formatDeadline(claim.deadline)}` : ''} și spune-ne câteva lucruri despre afacere, ca să începem.
      </p>

      <form method="post" action="/api/site-gratuit/castig" className="porthole flex flex-col gap-6 p-7">
        <input type="hidden" name="t" value={t} />

        <div>
          <label htmlFor="claim-domain" className={labelClass}>
            Ai deja un domeniu (adresa site-ului)?
          </label>
          <select id="claim-domain" name="domain" defaultValue="Nu știu încă" className={inputClass}>
            <option>Am deja un domeniu</option>
            <option>Nu am încă un domeniu</option>
            <option>Nu știu încă</option>
          </select>
        </div>

        <div>
          <label htmlFor="claim-pages" className={labelClass}>
            Ce pagini vrei pe site? (până la 5)
          </label>
          <textarea id="claim-pages" name="pages" rows={3} maxLength={2000} placeholder="ex: Acasă, Servicii, Galerie, Despre, Contact" className={`${inputClass} resize-y`} />
        </div>

        <div>
          <label htmlFor="claim-services" className={labelClass}>
            Ce servicii sau produse oferi și la ce prețuri orientative?
          </label>
          <textarea id="claim-services" name="services" rows={4} maxLength={2000} className={`${inputClass} resize-y`} />
        </div>

        <div>
          <label htmlFor="claim-contact" className={labelClass}>
            Ce date de contact apar pe site? (telefon, WhatsApp, e-mail, program)
          </label>
          <textarea id="claim-contact" name="contact" rows={3} maxLength={2000} className={`${inputClass} resize-y`} />
        </div>

        <div>
          <label htmlFor="claim-notes" className={labelClass}>
            Altceva ce trebuie să știm? (opțional)
          </label>
          <textarea id="claim-notes" name="notes" rows={3} maxLength={2000} className={`${inputClass} resize-y`} />
        </div>

        <label className={checkboxLabelClass}>
          <input name="accept" type="checkbox" value="da" required className={checkboxClass} />
          <span>
            Accept premiul în condițiile din{' '}
            <Link href={RULES_PATH} className={textLinkClass}>
              regulament
            </Link>
            . Știu că domeniul și găzduirea le plătesc eu, pe numele afacerii mele.
          </span>
        </label>

        <label className={checkboxLabelClass}>
          <input name="publish" type="checkbox" value="da" className={checkboxClass} />
          <span>Sunt de acord ca MAST Studio să publice numele afacerii mele și site-ul ca și câștigător, pe site și pe rețelele sociale. (opțional)</span>
        </label>

        <button type="submit" className={primaryButtonClass}>
          Confirm premiul
        </button>
      </form>
    </ContestPrivatePage>
  )
}
