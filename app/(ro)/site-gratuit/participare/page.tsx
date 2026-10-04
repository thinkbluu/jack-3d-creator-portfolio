import Link from 'next/link'
import ContestPrivatePage, { InvalidLink, Notice, privateMetadata } from '@/components/ContestPrivatePage'
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass, textLinkClass } from '@/components/form-styles'
import TrackConversionOnLoad from '@/components/TrackConversionOnLoad'
import { CONTEST_HASHTAG, RULES_PATH, isContestConfigured, roundEndLabel, roundLabel } from '@/lib/contest/config'
import { getParticipation } from '@/lib/contest/service'
import { verifyToken } from '@/lib/contest/tokens'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { FACEBOOK_URL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

type EntryState = 'confirmat' | 'salvat' | 'link-invalid' | 'already-won' | 'not-allowed' | 'retras' | 'revenit' | 'eroare'
type EntryMessage = { text: string; success?: boolean }

const messages: Record<Locale, Record<EntryState, EntryMessage>> = {
  ro: {
    confirmat: { text: 'Înscrierea e confirmată. Ți-am trimis pe e-mail pașii și linkul către această pagină; păstrează-l.', success: true },
    salvat: { text: 'Linkul postării a fost salvat. Postarea intră în clasamentul acestei runde.', success: true },
    'link-invalid': { text: 'Linkul trebuie să fie al unei postări publice: de pe Instagram (adresă cu /p/ sau /reel/) sau de pe pagina de Facebook a afacerii.' },
    'already-won': { text: 'Ai câștigat deja un site în acest concurs, așa că nu mai poți participa. Îți mulțumim!' },
    'not-allowed': { text: 'Înscrierea nu mai poate fi modificată în această rundă.' },
    retras: { text: 'Te-ai retras din concurs. Nu mai primești e-mailuri despre runde.', success: true },
    revenit: { text: 'Ai revenit în concurs, în runda din această lună.', success: true },
    eroare: { text: 'Ceva nu a mers. Încearcă din nou peste câteva minute.' },
  },
  en: {
    confirmat: { text: 'Your entry is confirmed. We emailed you the steps and the link to this page; keep it.', success: true },
    salvat: { text: 'The link to the post has been saved. The post goes into this round’s ranking.', success: true },
    'link-invalid': { text: 'The link must be a public post: from Instagram (an address with /p/ or /reel/) or from the business’s Facebook page.' },
    'already-won': { text: 'You have already won a website in this contest, so you cannot enter again. Thank you!' },
    'not-allowed': { text: 'The entry can no longer be changed in this round.' },
    retras: { text: 'You have withdrawn from the contest. You will no longer receive emails about rounds.', success: true },
    revenit: { text: 'You are back in the contest, in this month’s round.', success: true },
    eroare: { text: 'Something went wrong. Try again in a few minutes.' },
  },
}

const participationRo = {
    metaTitle: 'Participarea ta la concurs',
    invalidTitle: 'Participarea ta la concurs',
    hello: (first: string) => `Bună, ${first}`,
    roundKicker: (roundName: string) => `Runda din ${roundName}`,
    roundLine: (business: string, end: string) => `${business} · runda se încheie pe ${end}.`,
    postLead: 'Postarea ta din această rundă:',
    noPost: 'Nu ai adăugat încă linkul postării pentru această rundă.',
    withdrawn: 'Te-ai retras din concurs. Poți reveni oricând, în runda din luna curentă.',
    rejoin: 'Revin în concurs',
    alreadyWon: 'Ai câștigat deja un site în acest concurs. Îți mulțumim că ai participat!',
    howTitle: 'Cum participi luna aceasta',
    steps: [
      'Publică o postare despre afacerea ta și despre de ce ai nevoie de site: pe',
      'Etichetează-ne',
      'Lasă postarea publică și cu aprecierile vizibile până la anunțarea câștigătorului.',
      'Adaugă mai jos linkul postării, până la finalul lunii.',
    ],
    step1Mid: ', din contul afacerii, sau pe pagina de',
    step1After: 'a afacerii.',
    step2After: `pe Instagram, MAST Studio pe Facebook) și folosește ${CONTEST_HASHTAG}.`,
    postLabel: 'Linkul postării',
    updateLink: 'Actualizează linkul',
    saveLink: 'Salvează linkul',
    withdrawBody: 'Nu mai vrei să participi? Te poți retrage oricând. Datele tale se șterg la 12 luni după ultima rundă; dacă vrei să le ștergem imediat, scrie-ne.',
    withdraw: 'Mă retrag din concurs',
    rulesBefore: 'Detalii în',
    rulesLink: 'regulamentul concursului',
    rulesAfter: '.',
}

const participationEn: typeof participationRo = {
    metaTitle: 'Your contest entry',
    invalidTitle: 'Your contest entry',
    hello: (first: string) => `Hello, ${first}`,
    roundKicker: (roundName: string) => `The ${roundName} round`,
    roundLine: (business: string, end: string) => `${business} · the round ends on ${end}.`,
    postLead: 'Your post in this round:',
    noPost: 'You have not added the link to your post for this round yet.',
    withdrawn: 'You have withdrawn from the contest. You can come back at any time, in the current month’s round.',
    rejoin: 'Rejoin the contest',
    alreadyWon: 'You have already won a website in this contest. Thank you for taking part!',
    howTitle: 'How to enter this month',
    steps: [
      'Publish a post about your business and about why you need a website: on',
      'Tag us',
      'Leave the post public, with the likes visible, until the winner is announced.',
      'Add the link to the post below, by the end of the month.',
    ],
    step1Mid: ', from the business account, or on the business’s',
    step1After: 'page.',
    step2After: `on Instagram, MAST Studio on Facebook) and use ${CONTEST_HASHTAG}.`,
    postLabel: 'Link to the post',
    updateLink: 'Update the link',
    saveLink: 'Save the link',
    withdrawBody: 'Do you no longer want to take part? You can withdraw at any time. Your data is deleted 12 months after the last round; if you want us to delete it immediately, write to us.',
    withdraw: 'Withdraw from the contest',
    rulesBefore: 'Details are in the',
    rulesLink: 'contest rules',
    rulesAfter: '.',
}

const pageCopy = { ro: participationRo, en: participationEn }

// Conversions counted when the page is reached after a successful action.
const conversions: Record<string, string> = { confirmat: 'contest_confirmed', salvat: 'contest_post_saved' }

type Props = { locale: Locale; searchParams: Promise<{ t?: string; stare?: string }> }

export function participationMetadata(locale: Locale) {
  return privateMetadata(pageCopy[locale].metaTitle)
}

export async function ParticipationView({ locale, searchParams }: Props) {
  const t = pageCopy[locale]
  const { t: token, stare } = await searchParams
  const entrantId = isContestConfigured() ? verifyToken(token, 'manage') : null
  const participation = entrantId ? await getParticipation(entrantId) : null
  const message = stare && Object.hasOwn(messages[locale], stare) ? messages[locale][stare as EntryState] : undefined

  if (!entrantId || !participation) {
    return (
      <ContestPrivatePage locale={locale} title={t.invalidTitle}>
        <InvalidLink locale={locale} />
      </ContestPrivatePage>
    )
  }

  const { round, entry } = participation
  const canPost = !participation.withdrawn && !participation.hasWon && (!entry || ['active', 'withdrawn'].includes(entry.status))

  return (
    <ContestPrivatePage locale={locale} title={t.hello(participation.name.split(' ')[0])}>
      {message ? <Notice tone={message.success ? 'success' : 'info'}>{message.text}</Notice> : null}
      {stare && Object.hasOwn(conversions, stare) ? <TrackConversionOnLoad event={conversions[stare]} /> : null}

      <section className="porthole flex flex-col gap-3 p-6">
        <p className="kicker">{t.roundKicker(roundLabel(round, locale))}</p>
        <p className="type-body text-[var(--ink)]">{t.roundLine(participation.businessName, roundEndLabel(round, locale))}</p>
        {entry?.postUrl ? (
          <p className="type-body">
            {t.postLead}{' '}
            <a href={entry.postUrl} target="_blank" rel="noopener noreferrer" className={`${textLinkClass} break-all`}>
              {entry.postUrl}
            </a>
          </p>
        ) : (
          <p className="type-body">{t.noPost}</p>
        )}
      </section>

      {participation.withdrawn ? (
        <form method="post" action="/api/site-gratuit/participare" className="flex flex-col items-start gap-4">
          <input type="hidden" name="t" value={token} />
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="actiune" value="revenire" />
          <p className="type-body">{t.withdrawn}</p>
          <button type="submit" className={primaryButtonClass}>
            {t.rejoin}
          </button>
        </form>
      ) : null}

      {participation.hasWon ? <p className="type-body">{t.alreadyWon}</p> : null}

      {canPost ? (
        <>
          <section className="flex flex-col gap-3">
            <h2 className="type-h3">{t.howTitle}</h2>
            <ol className="type-body flex list-decimal flex-col gap-2 pl-6">
              <li>
                {t.steps[0]}{' '}
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                  Instagram
                </a>
                {t.step1Mid}{' '}
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                  Facebook
                </a>{' '}
                {t.step1After}
              </li>
              <li>
                {t.steps[1]} ({INSTAGRAM_HANDLE} {t.step2After}
              </li>
              <li>{t.steps[2]}</li>
              <li>{t.steps[3]}</li>
            </ol>
          </section>

          <form method="post" action="/api/site-gratuit/participare" className="flex flex-col items-start gap-4">
            <input type="hidden" name="t" value={token} />
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="actiune" value="postare" />
            <div className="w-full">
              <label htmlFor="post-url" className={labelClass}>
                {t.postLabel}
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
              {entry?.postUrl ? t.updateLink : t.saveLink}
            </button>
          </form>
        </>
      ) : null}

      {!participation.withdrawn && !participation.hasWon ? (
        <form method="post" action="/api/site-gratuit/participare" className="border-t border-[var(--hairline)] pt-6">
          <input type="hidden" name="t" value={token} />
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="actiune" value="retragere" />
          <p className="type-body text-[15px]">{t.withdrawBody}</p>
          <button type="submit" className={`${secondaryButtonClass} mt-3`}>
            {t.withdraw}
          </button>
        </form>
      ) : null}

      <p className="font-sans text-sm text-[var(--ink-2)]">
        {t.rulesBefore}{' '}
        <Link href={localizePath(RULES_PATH, locale)} className={textLinkClass}>
          {t.rulesLink}
        </Link>
        {t.rulesAfter}
      </p>
    </ContestPrivatePage>
  )
}

export const metadata = participationMetadata('ro')

export default function ParticipationPage({ searchParams }: { searchParams: Promise<{ t?: string; stare?: string }> }) {
  return <ParticipationView locale="ro" searchParams={searchParams} />
}
