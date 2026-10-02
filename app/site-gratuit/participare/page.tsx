import Link from 'next/link'
import ContestPrivatePage, { InvalidLink, Notice, privateMetadata } from '@/components/ContestPrivatePage'
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass, textLinkClass } from '@/components/form-styles'
import TrackConversionOnLoad from '@/components/TrackConversionOnLoad'
import { CONTEST_HASHTAG, RULES_PATH, isContestConfigured, roundEndLabel, roundLabel } from '@/lib/contest/config'
import { getParticipation } from '@/lib/contest/service'
import { verifyToken } from '@/lib/contest/tokens'
import { FACEBOOK_URL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'
export const metadata = privateMetadata('Participarea ta la concurs')

// Conversions counted when the page is reached after a successful action.
const conversions: Record<string, string> = { confirmat: 'contest_confirmed', salvat: 'contest_post_saved' }

const messages: Record<string, { text: string; success?: boolean }> = {
  confirmat: { text: 'Înscrierea e confirmată. Ți-am trimis pe e-mail pașii și linkul către această pagină; păstrează-l.', success: true },
  salvat: { text: 'Linkul postării a fost salvat. Postarea intră în clasamentul acestei runde.', success: true },
  'link-invalid': { text: 'Linkul trebuie să fie al unei postări publice: de pe Instagram (adresă cu /p/ sau /reel/) sau de pe pagina de Facebook a afacerii.' },
  'already-won': { text: 'Ai câștigat deja un site în acest concurs, așa că nu mai poți participa. Îți mulțumim!' },
  'not-allowed': { text: 'Înscrierea nu mai poate fi modificată în această rundă.' },
  retras: { text: 'Te-ai retras din concurs. Nu mai primești e-mailuri despre runde.', success: true },
  revenit: { text: 'Ai revenit în concurs, în runda din această lună.', success: true },
  eroare: { text: 'Ceva nu a mers. Încearcă din nou peste câteva minute.' },
}

type Props = { searchParams: Promise<{ t?: string; stare?: string }> }

export default async function ParticipationPage({ searchParams }: Props) {
  const { t, stare } = await searchParams
  const entrantId = isContestConfigured() ? verifyToken(t, 'manage') : null
  const participation = entrantId ? await getParticipation(entrantId) : null
  const message = stare && Object.hasOwn(messages, stare) ? messages[stare] : undefined

  if (!entrantId || !participation) {
    return (
      <ContestPrivatePage title="Participarea ta la concurs">
        <InvalidLink />
      </ContestPrivatePage>
    )
  }

  const { round, entry } = participation
  const canPost = !participation.withdrawn && !participation.hasWon && (!entry || ['active', 'withdrawn'].includes(entry.status))

  return (
    <ContestPrivatePage title={`Bună, ${participation.name.split(' ')[0]}`}>
      {message ? <Notice tone={message.success ? 'success' : 'info'}>{message.text}</Notice> : null}
      {stare && Object.hasOwn(conversions, stare) ? <TrackConversionOnLoad event={conversions[stare]} /> : null}

      <section className="porthole flex flex-col gap-3 p-6">
        <p className="kicker">Runda din {roundLabel(round)}</p>
        <p className="type-body text-[var(--ink)]">
          {participation.businessName} · runda se încheie pe {roundEndLabel(round)}.
        </p>
        {entry?.postUrl ? (
          <p className="type-body">
            Postarea ta din această rundă:{' '}
            <a href={entry.postUrl} target="_blank" rel="noopener noreferrer" className={`${textLinkClass} break-all`}>
              {entry.postUrl}
            </a>
          </p>
        ) : (
          <p className="type-body">Nu ai adăugat încă linkul postării pentru această rundă.</p>
        )}
      </section>

      {participation.withdrawn ? (
        <form method="post" action="/api/site-gratuit/participare" className="flex flex-col items-start gap-4">
          <input type="hidden" name="t" value={t} />
          <input type="hidden" name="actiune" value="revenire" />
          <p className="type-body">Te-ai retras din concurs. Poți reveni oricând, în runda din luna curentă.</p>
          <button type="submit" className={primaryButtonClass}>
            Revin în concurs
          </button>
        </form>
      ) : null}

      {participation.hasWon ? <p className="type-body">Ai câștigat deja un site în acest concurs. Îți mulțumim că ai participat!</p> : null}

      {canPost ? (
        <>
          <section className="flex flex-col gap-3">
            <h2 className="type-h3">Cum participi luna aceasta</h2>
            <ol className="type-body flex list-decimal flex-col gap-2 pl-6">
              <li>
                Publică o postare despre afacerea ta și despre de ce ai nevoie de site: pe{' '}
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                  Instagram
                </a>
                , din contul afacerii, sau pe pagina de{' '}
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                  Facebook
                </a>{' '}
                a afacerii.
              </li>
              <li>
                Etichetează-ne ({INSTAGRAM_HANDLE} pe Instagram, MAST Studio pe Facebook) și folosește {CONTEST_HASHTAG}.
              </li>
              <li>Lasă postarea publică și cu aprecierile vizibile până la anunțarea câștigătorului.</li>
              <li>Adaugă mai jos linkul postării, până la finalul lunii.</li>
            </ol>
          </section>

          <form method="post" action="/api/site-gratuit/participare" className="flex flex-col items-start gap-4">
            <input type="hidden" name="t" value={t} />
            <input type="hidden" name="actiune" value="postare" />
            <div className="w-full">
              <label htmlFor="post-url" className={labelClass}>
                Linkul postării
              </label>
              <input
                id="post-url"
                name="postUrl"
                type="url"
                inputMode="url"
                required
                maxLength={500}
                defaultValue={entry?.postUrl ?? ''}
                placeholder="https://www.instagram.com/p/..."
                className={inputClass}
              />
            </div>
            <button type="submit" className={primaryButtonClass}>
              {entry?.postUrl ? 'Actualizează linkul' : 'Salvează linkul'}
            </button>
          </form>
        </>
      ) : null}

      {!participation.withdrawn && !participation.hasWon ? (
        <form method="post" action="/api/site-gratuit/participare" className="border-t border-[var(--hairline)] pt-6">
          <input type="hidden" name="t" value={t} />
          <input type="hidden" name="actiune" value="retragere" />
          <p className="type-body text-[15px]">Nu mai vrei să participi? Te poți retrage oricând. Datele tale se șterg la 12 luni după ultima rundă; dacă vrei să le ștergem imediat, scrie-ne.</p>
          <button type="submit" className={`${secondaryButtonClass} mt-3`}>
            Mă retrag din concurs
          </button>
        </form>
      ) : null}

      <p className="font-sans text-sm text-[var(--ink-2)]">
        Detalii în{' '}
        <Link href={RULES_PATH} className={textLinkClass}>
          regulamentul concursului
        </Link>
        .
      </p>
    </ContestPrivatePage>
  )
}
