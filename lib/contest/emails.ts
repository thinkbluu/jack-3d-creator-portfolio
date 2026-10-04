import { escapeHtml, fromAddress, resendClient } from '@/lib/email'
import { intlLocale, type Locale } from '@/lib/i18n/locale'
import { EMAIL, INSTAGRAM_HANDLE, absoluteUrl } from '@/lib/site'
import { CLAIM_DAYS, CONTEST_HASHTAG, CONTEST_NAME, RULES_PATH, roundEndLabel, roundLabel, shiftRound } from './config'

export type Mail = { to: string; subject: string; text: string; html: string }

type Block = string | { label: string; url: string }

function compose(to: string, subject: string, blocks: Block[]): Mail {
  const text = blocks.map((block) => (typeof block === 'string' ? block : `${block.label}: ${block.url}`)).join('\n\n')
  const html = blocks
    .map((block) =>
      typeof block === 'string'
        ? `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`
        : `<p><a href="${escapeHtml(block.url)}">${escapeHtml(block.label)}</a></p>`,
    )
    .join('')
  return { to, subject, text, html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1714">${html}</div>` }
}

const firstName = (name: string) => name.trim().split(/\s+/)[0]
const rules = { label: 'Regulamentul concursului', url: absoluteUrl(RULES_PATH) }
const signature = 'Echipa MAST Studio'

export function formatDeadline(date: Date, locale: Locale = 'ro') {
  return new Intl.DateTimeFormat(intlLocale(locale), { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' }).format(date)
}

export const contestMails = {
  confirm: (to: string, name: string, businessName: string, link: string, locale: Locale = 'ro') =>
    locale === 'en'
      ? compose(to, 'Confirm your entry in the “A free website every month” contest', [
          `Hello ${firstName(name)},`,
          `One step left: confirm the entry for ${businessName}. The link is valid for 3 days.`,
          { label: 'Confirm your entry', url: link },
          'If you did not sign up, ignore this email. We do not keep unconfirmed entries.',
          'The MAST Studio team',
        ])
      : compose(to, `Confirmă înscrierea la concursul „${CONTEST_NAME}”`, [
          `Bună, ${firstName(name)},`,
          `Mai ai un pas: confirmă înscrierea pentru ${businessName}. Linkul e valabil 3 zile.`,
          { label: 'Confirmă înscrierea', url: link },
          'Dacă nu te-ai înscris tu, ignoră acest e-mail. Nu păstrăm înscrierile neconfirmate.',
          signature,
        ]),

  alreadyRegistered: (to: string, name: string, link: string, locale: Locale = 'ro') =>
    locale === 'en'
      ? compose(to, 'You are already entered in the contest', [
          `Hello ${firstName(name)},`,
          'This address is already entered and confirmed. On your entry page you can see the current round and add the link to your post.',
          { label: 'Your entry page', url: link },
          'The MAST Studio team',
        ])
      : compose(to, 'Ești deja înscris la concurs', [
          `Bună, ${firstName(name)},`,
          'Adresa ta e deja înscrisă și confirmată. Pe pagina ta de participare vezi runda curentă și poți adăuga linkul postării.',
          { label: 'Pagina ta de participare', url: link },
          signature,
        ]),

  welcome: (to: string, name: string, round: string, manageLink: string) =>
    compose(to, `Ești înscris în runda din ${roundLabel(round)}`, [
      `Bună, ${firstName(name)},`,
      `Înscrierea e confirmată. Ce urmează, până pe ${roundEndLabel(round)}:`,
      `1. Publică pe Instagram, din contul afacerii, sau pe pagina de Facebook a afacerii o postare despre ce faci și de ce ai nevoie de site.\n2. Etichetează-ne (${INSTAGRAM_HANDLE} pe Instagram, MAST Studio pe Facebook) și folosește ${CONTEST_HASHTAG}.\n3. Adaugă linkul postării pe pagina ta de participare.\n4. Strânge aprecieri: postarea cu cele mai multe aprecieri la finalul lunii câștigă.`,
      { label: 'Pagina ta de participare', url: manageLink },
      'Păstrează acest e-mail: linkul de mai sus e personal și îl poți folosi și în rundele următoare.',
      rules,
      signature,
    ]),

  reminder: (to: string, name: string, round: string, manageLink: string, daysLeft: number) =>
    compose(to, `Mai ai ${daysLeft} zile: adaugă linkul postării`, [
      `Bună, ${firstName(name)},`,
      `Runda din ${roundLabel(round)} se încheie pe ${roundEndLabel(round)}, iar noi nu avem încă linkul postării tale. Fără el, postarea nu intră în clasament.`,
      { label: 'Adaugă linkul postării', url: manageLink },
      signature,
    ]),

  roundClosedAdmin: (round: string, entries: number, adminLink: string) =>
    compose(EMAIL, `Concurs: runda din ${roundLabel(round)} s-a încheiat (${entries} postări)`, [
      entries > 0
        ? `Runda din ${roundLabel(round)} are ${entries} postări cu link. Deschide fiecare postare, notează numărul de aprecieri și desemnează câștigătorul. Linkul e valabil 30 de zile.`
        : `Runda din ${roundLabel(round)} s-a încheiat fără nicio postare cu link. Nu e nimic de făcut.`,
      ...(entries > 0 ? [{ label: 'Numără aprecierile și desemnează câștigătorul', url: adminLink }] : []),
    ]),

  winner: (to: string, name: string, round: string, claimLink: string, deadline: Date) =>
    compose(to, `Ai câștigat site-ul gratuit din ${roundLabel(round)}!`, [
      `Felicitări, ${firstName(name)}!`,
      `Postarea ta a strâns cele mai multe aprecieri în runda din ${roundLabel(round)}, așa că primești un site de prezentare construit gratuit de MAST Studio.`,
      `Confirmă premiul și spune-ne câteva lucruri despre afacere până pe ${formatDeadline(deadline)}. Dacă nu confirmi în ${CLAIM_DAYS} zile, premiul trece la următoarea postare din clasament.`,
      { label: 'Confirmă premiul', url: claimLink },
      rules,
      signature,
    ]),

  winnerSelectedAdmin: (round: string, businessName: string, email: string, postUrl: string, likes: number) =>
    compose(EMAIL, `Concurs: câștigătorul rundei din ${roundLabel(round)}`, [
      `Câștigător: ${businessName} (${email}), ${likes} aprecieri.`,
      { label: 'Postarea câștigătoare', url: postUrl },
      `I-am trimis linkul de confirmare. Are ${CLAIM_DAYS} zile; dacă nu confirmă, premiul trece automat la următoarea postare și primești un e-mail.`,
    ]),

  notSelected: (to: string, name: string, round: string, manageLink: string) =>
    compose(to, `Rezultatul rundei din ${roundLabel(round)}`, [
      `Bună, ${firstName(name)},`,
      `Îți mulțumim că ai participat. Luna aceasta, altă postare a strâns mai multe aprecieri, iar câștigătorul a fost anunțat pe e-mail.`,
      `Poți participa din nou în runda din ${roundLabel(shiftRound(round, 1))}, cu o postare nouă. Adaugă linkul ei pe pagina ta de participare.`,
      { label: 'Pagina ta de participare', url: manageLink },
      signature,
    ]),

  claimReceivedAdmin: (round: string, businessName: string, email: string, brief: Record<string, string>, deliveredLink: string) =>
    compose(EMAIL, `Concurs: ${businessName} a confirmat premiul (${roundLabel(round)})`, [
      `${businessName} (${email}) a confirmat premiul. Detaliile trimise:`,
      Object.entries(brief)
        .map(([label, value]) => `${label}: ${value || '-'}`)
        .join('\n'),
      'Când site-ul e gata, marchează-l ca livrat. Dacă afacerea a acceptat publicarea, apare apoi la câștigători pe pagina concursului.',
      { label: 'Marchează site-ul ca livrat', url: deliveredLink },
    ]),

  claimConfirmed: (to: string, name: string) =>
    compose(to, 'Am primit confirmarea ta', [
      `Bună, ${firstName(name)},`,
      'Am primit confirmarea și detaliile tale. Te contactăm în cel mult 2 zile lucrătoare ca să stabilim materialele (logo, poze, informații despre servicii) și termenul.',
      'Domeniul și găzduirea nu fac parte din premiu: le cumperi pe numele afacerii tale, orientativ 50-120 EUR pe an. Te ajutăm să le alegi.',
      signature,
    ]),

  claimExpiredAdmin: (round: string, expiredBusiness: string, nextBusiness: string | null) =>
    compose(EMAIL, `Concurs: premiul din ${roundLabel(round)} nu a fost confirmat`, [
      `${expiredBusiness} nu a confirmat premiul în ${CLAIM_DAYS} zile.`,
      nextBusiness
        ? `Premiul a trecut automat la ${nextBusiness}, care a primit linkul de confirmare.`
        : 'Nu mai există altă postare validă în clasament, așa că runda rămâne fără câștigător.',
    ]),

  newsletterDraftAdmin: (round: string) =>
    compose(EMAIL, `Newsletter: draftul pentru ${roundLabel(round)} e gata`, [
      'Am pregătit în Resend (Broadcasts) newsletterul lunar pentru abonați: ghidurile noi și concursul lunii. Verifică-l și trimite-l de acolo.',
    ]),
}

function payload(mail: Mail) {
  return { from: fromAddress('concurs'), replyTo: EMAIL, to: [mail.to], subject: mail.subject, text: mail.text, html: mail.html }
}

/** Sends the e-mails through Resend, in batches of 100. Returns how many were accepted. */
export async function sendMails(mails: Mail[]) {
  const resend = resendClient()
  if (!resend || mails.length === 0) return 0

  let sent = 0
  for (let index = 0; index < mails.length; index += 100) {
    const chunk = mails.slice(index, index + 100)
    try {
      const { error } = chunk.length === 1 ? await resend.emails.send(payload(chunk[0])) : await resend.batch.send(chunk.map(payload))
      if (error) console.error('[concurs] E-mailurile nu au putut fi trimise:', error.message)
      else sent += chunk.length
    } catch (error) {
      console.error('[concurs] Eroare la trimiterea e-mailurilor:', error)
    }
  }
  return sent
}
