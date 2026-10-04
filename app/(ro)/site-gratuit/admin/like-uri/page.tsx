import ContestPrivatePage, { InvalidLink, Notice, privateMetadata } from '@/components/ContestPrivatePage'
import { checkboxClass, inputClass, primaryButtonClass, textLinkClass } from '@/components/form-styles'
import { CLAIM_DAYS, isContestConfigured, roundLabel } from '@/lib/contest/config'
import { getRoundForAdmin } from '@/lib/contest/service'
import { verifyToken } from '@/lib/contest/tokens'
import type { Locale } from '@/lib/i18n/locale'

export const dynamic = 'force-dynamic'

type AdminState = 'winner-selected' | 'no-winner' | 'already-recorded' | 'not-closed' | 'lipsa-like-uri' | 'eroare'

const messages: Record<Locale, Record<AdminState, { text: string; success?: boolean }>> = {
  ro: {
    'winner-selected': { text: `Gata. Câștigătorul a primit linkul de confirmare (are ${CLAIM_DAYS} zile), iar ceilalți participanți au primit rezultatul.`, success: true },
    'no-winner': { text: 'Nu a rămas nicio postare validă, așa că runda nu are câștigător.', success: true },
    'already-recorded': { text: 'Aprecierile acestei runde au fost deja înregistrate.' },
    'not-closed': { text: 'Runda nu s-a încheiat încă.' },
    'lipsa-like-uri': { text: 'Completează numărul de aprecieri pentru fiecare postare sau marchează-o ca invalidă.' },
    eroare: { text: 'Ceva nu a mers. Încearcă din nou peste câteva minute.' },
  },
  en: {
    'winner-selected': { text: `Done. The winner has received the confirmation link (they have ${CLAIM_DAYS} days), and the other participants have received the result.`, success: true },
    'no-winner': { text: 'No valid post is left, so the round has no winner.', success: true },
    'already-recorded': { text: 'The likes for this round have already been recorded.' },
    'not-closed': { text: 'The round has not ended yet.' },
    'lipsa-like-uri': { text: 'Fill in the number of likes for each post, or mark it as invalid.' },
    eroare: { text: 'Something went wrong. Try again in a few minutes.' },
  },
}

const statusLabels: Record<Locale, Record<string, string>> = {
  ro: { active: 'validă', invalid: 'invalidă', selected: 'câștigătoare, așteaptă confirmarea', winner: 'câștigătoare', expired: 'neconfirmată la timp' },
  en: { active: 'valid', invalid: 'invalid', selected: 'winning, waiting for confirmation', winner: 'winning', expired: 'not confirmed in time' },
}

const likesRo = {
    metaTitle: 'Aprecierile rundei',
    invalidTitle: 'Aprecierile rundei',
    title: (roundName: string) => `Runda din ${roundName}`,
    notClosed: 'Runda nu s-a încheiat încă. Revino după finalul lunii.',
    empty: 'Nicio postare cu link în această rundă.',
    likesWord: 'aprecieri',
    post: 'postarea',
    instructions:
      'Deschide fiecare postare, notează numărul de aprecieri afișat acum și bifează „invalidă” dacă nu respectă regulamentul (nu ne etichetează, nu e publică, aprecieri cumpărate). La egalitate câștigă postarea trimisă prima. Poți salva o singură dată.',
    openPost: 'deschide postarea',
    likesLabel: 'Aprecieri',
    invalid: 'invalidă',
    submit: 'Salvează și desemnează câștigătorul',
}

const likesEn: typeof likesRo = {
    metaTitle: 'Round likes',
    invalidTitle: 'Round likes',
    title: (roundName: string) => `The ${roundName} round`,
    notClosed: 'The round has not ended yet. Come back after the end of the month.',
    empty: 'No post with a link in this round.',
    likesWord: 'likes',
    post: 'the post',
    instructions:
      'Open each post, note the number of likes shown now, and tick “invalid” if it does not follow the rules (it does not tag us, it is not public, the likes were bought). In a tie, the post submitted first wins. You can save only once.',
    openPost: 'open the post',
    likesLabel: 'Likes',
    invalid: 'invalid',
    submit: 'Save and select the winner',
}

const copy = { ro: likesRo, en: likesEn }

type Props = { locale: Locale; searchParams: Promise<{ t?: string; stare?: string }> }

export function adminLikesMetadata(locale: Locale) {
  return privateMetadata(copy[locale].metaTitle)
}

export async function AdminLikesView({ locale, searchParams }: Props) {
  const t = copy[locale]
  const { t: token, stare } = await searchParams
  const round = isContestConfigured() ? verifyToken(token, 'admin-likes') : null
  const data = round ? await getRoundForAdmin(round) : null
  const message = stare && Object.hasOwn(messages[locale], stare) ? messages[locale][stare as AdminState] : undefined

  if (!round || !data) {
    return (
      <ContestPrivatePage locale={locale} title={t.invalidTitle}>
        <InvalidLink locale={locale} />
      </ContestPrivatePage>
    )
  }

  return (
    <ContestPrivatePage locale={locale} title={t.title(roundLabel(round, locale))}>
      {message ? <Notice tone={message.success ? 'success' : 'info'}>{message.text}</Notice> : null}

      {!data.closed ? <p className="type-body">{t.notClosed}</p> : null}

      {data.closed && data.entries.length === 0 ? <p className="type-body">{t.empty}</p> : null}

      {data.closed && data.recorded ? (
        <ul className="flex flex-col divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
          {data.entries.map((entry) => (
            <li key={entry.id} className="flex flex-col gap-1 py-4">
              <p className="font-sans text-[15px] font-semibold text-[var(--ink)]">
                {entry.businessName} · {entry.likes ?? '-'} {t.likesWord}
              </p>
              <p className="font-sans text-sm text-[var(--ink-2)]">
                {entry.city} · {statusLabels[locale][entry.status] ?? entry.status} ·{' '}
                <a href={entry.postUrl} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                  {t.post}
                </a>
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      {data.closed && !data.recorded && data.entries.length > 0 ? (
        <form method="post" action="/api/site-gratuit/admin/like-uri" className="flex flex-col gap-6">
          <input type="hidden" name="t" value={token} />
          <input type="hidden" name="locale" value={locale} />
          <p className="type-body">{t.instructions}</p>
          <ul className="flex flex-col divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
            {data.entries.map((entry) => (
              <li key={entry.id} className="grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className="font-sans text-[15px] font-semibold text-[var(--ink)]">{entry.businessName}</p>
                  <p className="font-sans text-sm text-[var(--ink-2)]">
                    {entry.name}, {entry.city} ·{' '}
                    <a href={entry.postUrl} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                      {t.openPost}
                    </a>
                  </p>
                </div>
                <div className="flex items-end gap-4">
                  <label className="font-sans text-sm text-[var(--ink-2)]">
                    {t.likesLabel}
                    <input name={`likes_${entry.id}`} type="number" min={0} step={1} inputMode="numeric" className={`${inputClass} mt-1 w-32`} />
                  </label>
                  <label className="flex min-h-11 items-center gap-2 font-sans text-sm text-[var(--ink-2)]">
                    <input name={`invalid_${entry.id}`} type="checkbox" value="da" className={checkboxClass} />
                    {t.invalid}
                  </label>
                </div>
              </li>
            ))}
          </ul>
          <button type="submit" className={primaryButtonClass}>
            {t.submit}
          </button>
        </form>
      ) : null}
    </ContestPrivatePage>
  )
}

export const metadata = adminLikesMetadata('ro')

export default function AdminLikesPage({ searchParams }: { searchParams: Promise<{ t?: string; stare?: string }> }) {
  return <AdminLikesView locale="ro" searchParams={searchParams} />
}
