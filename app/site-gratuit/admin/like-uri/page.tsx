import ContestPrivatePage, { InvalidLink, Notice, privateMetadata } from '@/components/ContestPrivatePage'
import { checkboxClass, inputClass, primaryButtonClass, textLinkClass } from '@/components/form-styles'
import { CLAIM_DAYS, isContestConfigured, roundLabel } from '@/lib/contest/config'
import { getRoundForAdmin } from '@/lib/contest/service'
import { verifyToken } from '@/lib/contest/tokens'

export const dynamic = 'force-dynamic'
export const metadata = privateMetadata('Aprecierile rundei')

const messages: Record<string, { text: string; success?: boolean }> = {
  'winner-selected': { text: `Gata. Câștigătorul a primit linkul de confirmare (are ${CLAIM_DAYS} zile), iar ceilalți participanți au primit rezultatul.`, success: true },
  'no-winner': { text: 'Nu a rămas nicio postare validă, așa că runda nu are câștigător.', success: true },
  'already-recorded': { text: 'Aprecierile acestei runde au fost deja înregistrate.' },
  'not-closed': { text: 'Runda nu s-a încheiat încă.' },
  'lipsa-like-uri': { text: 'Completează numărul de aprecieri pentru fiecare postare sau marchează-o ca invalidă.' },
  eroare: { text: 'Ceva nu a mers. Încearcă din nou peste câteva minute.' },
}

const statusLabels: Record<string, string> = { active: 'validă', invalid: 'invalidă', selected: 'câștigătoare, așteaptă confirmarea', winner: 'câștigătoare', expired: 'neconfirmată la timp' }

type Props = { searchParams: Promise<{ t?: string; stare?: string }> }

export default async function AdminLikesPage({ searchParams }: Props) {
  const { t, stare } = await searchParams
  const round = isContestConfigured() ? verifyToken(t, 'admin-likes') : null
  const data = round ? await getRoundForAdmin(round) : null
  const message = stare ? messages[stare] : undefined

  if (!round || !data) {
    return (
      <ContestPrivatePage title="Aprecierile rundei">
        <InvalidLink />
      </ContestPrivatePage>
    )
  }

  return (
    <ContestPrivatePage title={`Runda din ${roundLabel(round)}`}>
      {message ? <Notice tone={message.success ? 'success' : 'info'}>{message.text}</Notice> : null}

      {!data.closed ? <p className="type-body">Runda nu s-a încheiat încă. Revino după finalul lunii.</p> : null}

      {data.closed && data.entries.length === 0 ? <p className="type-body">Nicio postare cu link în această rundă.</p> : null}

      {data.closed && data.recorded ? (
        <ul className="flex flex-col divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
          {data.entries.map((entry) => (
            <li key={entry.id} className="flex flex-col gap-1 py-4">
              <p className="font-sans text-[15px] font-semibold text-[var(--ink)]">
                {entry.businessName} · {entry.likes ?? '-'} aprecieri
              </p>
              <p className="font-sans text-sm text-[var(--ink-2)]">
                {entry.city} · {statusLabels[entry.status] ?? entry.status} ·{' '}
                <a href={entry.postUrl} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                  postarea
                </a>
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      {data.closed && !data.recorded && data.entries.length > 0 ? (
        <form method="post" action="/api/site-gratuit/admin/like-uri" className="flex flex-col gap-6">
          <input type="hidden" name="t" value={t} />
          <p className="type-body">
            Deschide fiecare postare, notează numărul de aprecieri afișat acum și bifează „invalidă” dacă nu respectă regulamentul (nu ne etichetează, nu e publică, aprecieri cumpărate). La egalitate câștigă postarea trimisă prima. Poți salva o singură dată.
          </p>
          <ul className="flex flex-col divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
            {data.entries.map((entry) => (
              <li key={entry.id} className="grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className="font-sans text-[15px] font-semibold text-[var(--ink)]">{entry.businessName}</p>
                  <p className="font-sans text-sm text-[var(--ink-2)]">
                    {entry.name}, {entry.city} ·{' '}
                    <a href={entry.postUrl} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                      deschide postarea
                    </a>
                  </p>
                </div>
                <div className="flex items-end gap-4">
                  <label className="font-sans text-sm text-[var(--ink-2)]">
                    Aprecieri
                    <input name={`likes_${entry.id}`} type="number" min={0} step={1} inputMode="numeric" className={`${inputClass} mt-1 w-32`} />
                  </label>
                  <label className="flex min-h-11 items-center gap-2 font-sans text-sm text-[var(--ink-2)]">
                    <input name={`invalid_${entry.id}`} type="checkbox" value="da" className={checkboxClass} />
                    invalidă
                  </label>
                </div>
              </li>
            ))}
          </ul>
          <button type="submit" className={primaryButtonClass}>
            Salvează și desemnează câștigătorul
          </button>
        </form>
      ) : null}
    </ContestPrivatePage>
  )
}
