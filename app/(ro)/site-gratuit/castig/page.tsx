import Link from 'next/link'
import ContestPrivatePage, { InvalidLink, Notice, privateMetadata } from '@/components/ContestPrivatePage'
import { checkboxClass, checkboxLabelClass, inputClass, labelClass, primaryButtonClass, textLinkClass } from '@/components/form-styles'
import TrackConversionOnLoad from '@/components/TrackConversionOnLoad'
import { CLAIM_DAYS, RULES_PATH, isContestConfigured, roundLabel } from '@/lib/contest/config'
import { formatDeadline } from '@/lib/contest/emails'
import { getClaim } from '@/lib/contest/service'
import { verifyToken } from '@/lib/contest/tokens'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'

export const dynamic = 'force-dynamic'

type ClaimState = 'fara-acord' | 'expired' | 'already-claimed' | 'invalid' | 'eroare'

const messages = {
  ro: {
    'fara-acord': 'Ca să primești premiul, bifează acordul cu condițiile din regulament.',
    expired: `Termenul de ${CLAIM_DAYS} zile a trecut, așa că premiul a trecut la următoarea postare din clasament.`,
    'already-claimed': 'Premiul a fost deja confirmat.',
    invalid: 'Linkul nu mai e valabil.',
    eroare: 'Ceva nu a mers. Încearcă din nou peste câteva minute.',
  },
  en: {
    'fara-acord': 'To receive the prize, tick the box to agree to the conditions in the rules.',
    expired: `The ${CLAIM_DAYS}-day deadline has passed, so the prize has gone to the next post in the ranking.`,
    'already-claimed': 'The prize has already been confirmed.',
    invalid: 'The link is no longer valid.',
    eroare: 'Something went wrong. Try again in a few minutes.',
  },
} satisfies Record<Locale, Record<ClaimState, string>>

const domainOptions = [
  { value: 'Am deja un domeniu', ro: 'Am deja un domeniu', en: 'I already have a domain' },
  { value: 'Nu am încă un domeniu', ro: 'Nu am încă un domeniu', en: 'I do not have a domain yet' },
  { value: 'Nu știu încă', ro: 'Nu știu încă', en: 'I do not know yet' },
] as const

const claimRo = {
    metaTitle: 'Confirmă premiul',
    invalidTitle: 'Confirmă premiul',
    receivedTitle: 'Am primit confirmarea',
    received: (first: string, business: string) => `Mulțumim, ${first}! Am primit confirmarea și detaliile pentru ${business}. Te contactăm în cel mult 2 zile lucrătoare.`,
    expiredTitle: 'Termenul a expirat',
    congrats: (first: string) => `Felicitări, ${first}!`,
    won: (business: string, roundName: string, deadline: string | null) =>
      deadline
        ? `Postarea pentru ${business} a câștigat runda din ${roundName}. Confirmă premiul până pe ${deadline} și spune-ne câteva lucruri despre afacere, ca să începem.`
        : `Postarea pentru ${business} a câștigat runda din ${roundName}. Confirmă premiul și spune-ne câteva lucruri despre afacere, ca să începem.`,
    domain: 'Ai deja un domeniu (adresa site-ului)?',
    pages: 'Ce pagini vrei pe site? (până la 5)',
    pagesPlaceholder: 'ex: Acasă, Servicii, Galerie, Despre, Contact',
    services: 'Ce servicii sau produse oferi și la ce prețuri orientative?',
    contact: 'Ce date de contact apar pe site? (telefon, WhatsApp, e-mail, program)',
    notes: 'Altceva ce trebuie să știm? (opțional)',
    acceptBefore: 'Accept premiul în condițiile din',
    acceptLink: 'regulament',
    acceptAfter: '. Știu că domeniul și găzduirea le plătesc eu, pe numele afacerii mele.',
    publish: 'Sunt de acord ca MAST Studio să publice numele afacerii mele și site-ul ca și câștigător, pe site și pe rețelele sociale. (opțional)',
    submit: 'Confirm premiul',
}

const claimEn: typeof claimRo = {
    metaTitle: 'Confirm the prize',
    invalidTitle: 'Confirm the prize',
    receivedTitle: 'We have your confirmation',
    received: (first: string, business: string) => `Thank you, ${first}! We have the confirmation and the details for ${business}. We will contact you within 2 working days.`,
    expiredTitle: 'The deadline has passed',
    congrats: (first: string) => `Congratulations, ${first}!`,
    won: (business: string, roundName: string, deadline: string | null) =>
      deadline
        ? `The post for ${business} won the ${roundName} round. Confirm the prize by ${deadline} and tell us a few things about the business, so we can get started.`
        : `The post for ${business} won the ${roundName} round. Confirm the prize and tell us a few things about the business, so we can get started.`,
    domain: 'Do you already have a domain (the website address)?',
    pages: 'Which pages do you want on the website? (up to 5)',
    pagesPlaceholder: 'e.g. Home, Services, Gallery, About, Contact',
    services: 'What services or products do you offer, and at what indicative prices?',
    contact: 'Which contact details should appear on the website? (phone, WhatsApp, email, opening hours)',
    notes: 'Anything else we should know? (optional)',
    acceptBefore: 'I accept the prize on the conditions in the',
    acceptLink: 'rules',
    acceptAfter: '. I know that I pay for the domain and hosting, in my business’s name.',
    publish: 'I agree that MAST Studio may publish my business name and the website as a winner, on the website and on social networks. (optional)',
    submit: 'Confirm the prize',
}

const copy = { ro: claimRo, en: claimEn }

type Props = { locale: Locale; searchParams: Promise<{ t?: string; stare?: string }> }

export function claimMetadata(locale: Locale) {
  return privateMetadata(copy[locale].metaTitle)
}

export async function ClaimView({ locale, searchParams }: Props) {
  const t = copy[locale]
  const { t: token, stare } = await searchParams
  const entryId = isContestConfigured() ? verifyToken(token, 'claim') : null
  const claim = entryId ? await getClaim(entryId) : null

  if (!claim) {
    return (
      <ContestPrivatePage locale={locale} title={t.invalidTitle}>
        <InvalidLink locale={locale} />
      </ContestPrivatePage>
    )
  }

  if (claim.claimed) {
    return (
      <ContestPrivatePage locale={locale} title={t.receivedTitle}>
        <Notice tone="success">{t.received(claim.name.split(' ')[0], claim.businessName)}</Notice>
        {stare === 'confirmat' ? <TrackConversionOnLoad event="contest_prize_claimed" /> : null}
      </ContestPrivatePage>
    )
  }

  if (claim.expired) {
    return (
      <ContestPrivatePage locale={locale} title={t.expiredTitle}>
        <p className="type-body">{messages[locale].expired}</p>
      </ContestPrivatePage>
    )
  }

  return (
    <ContestPrivatePage locale={locale} title={t.congrats(claim.name.split(' ')[0])}>
      {stare && Object.hasOwn(messages[locale], stare) ? <Notice>{messages[locale][stare as ClaimState]}</Notice> : null}
      <p className="type-body">{t.won(claim.businessName, roundLabel(claim.round, locale), claim.deadline ? formatDeadline(claim.deadline, locale) : null)}</p>

      <form method="post" action="/api/site-gratuit/castig" className="porthole flex flex-col gap-6 p-7">
        <input type="hidden" name="t" value={token} />
        <input type="hidden" name="locale" value={locale} />

        <div>
          <label htmlFor="claim-domain" className={labelClass}>
            {t.domain}
          </label>
          <select id="claim-domain" name="domain" defaultValue="Nu știu încă" className={inputClass}>
            {domainOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option[locale]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="claim-pages" className={labelClass}>
            {t.pages}
          </label>
          <textarea id="claim-pages" name="pages" rows={3} maxLength={2000} placeholder={t.pagesPlaceholder} className={`${inputClass} resize-y`} />
        </div>

        <div>
          <label htmlFor="claim-services" className={labelClass}>
            {t.services}
          </label>
          <textarea id="claim-services" name="services" rows={4} maxLength={2000} className={`${inputClass} resize-y`} />
        </div>

        <div>
          <label htmlFor="claim-contact" className={labelClass}>
            {t.contact}
          </label>
          <textarea id="claim-contact" name="contact" rows={3} maxLength={2000} className={`${inputClass} resize-y`} />
        </div>

        <div>
          <label htmlFor="claim-notes" className={labelClass}>
            {t.notes}
          </label>
          <textarea id="claim-notes" name="notes" rows={3} maxLength={2000} className={`${inputClass} resize-y`} />
        </div>

        <label className={checkboxLabelClass}>
          <input name="accept" type="checkbox" value="da" required className={checkboxClass} />
          <span>
            {t.acceptBefore}{' '}
            <Link href={localizePath(RULES_PATH, locale)} className={textLinkClass}>
              {t.acceptLink}
            </Link>
            {t.acceptAfter}
          </span>
        </label>

        <label className={checkboxLabelClass}>
          <input name="publish" type="checkbox" value="da" className={checkboxClass} />
          <span>{t.publish}</span>
        </label>

        <button type="submit" className={primaryButtonClass}>
          {t.submit}
        </button>
      </form>
    </ContestPrivatePage>
  )
}

export const metadata = claimMetadata('ro')

export default function ClaimPage({ searchParams }: { searchParams: Promise<{ t?: string; stare?: string }> }) {
  return <ClaimView locale="ro" searchParams={searchParams} />
}
