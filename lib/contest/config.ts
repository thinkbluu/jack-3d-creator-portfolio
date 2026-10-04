import { intlLocale, type Locale } from '@/lib/i18n/locale'

// The monthly free-site contest ("Site gratuit în fiecare lună"). Each round
// is one calendar month in Romanian time; the post with the most likes wins.

export const CONTEST_NAME = 'Site gratuit în fiecare lună'
export const CONTEST_PATH = '/site-gratuit'
export const RULES_PATH = '/site-gratuit/regulament'
export const CONTEST_HASHTAG = '#SiteGratuitMAST'
/** Pages opened from personal links in e-mails; their address carries an access token. */
export const PRIVATE_CONTEST_PATHS = ['/site-gratuit/confirmare', '/site-gratuit/participare', '/site-gratuit/castig', '/site-gratuit/admin/']
export const PRIZE_VALUE_EUR = 300

/** Days the winner has to accept the prize before it passes to the next post. */
export const CLAIM_DAYS = 7
/** Entrants without a post link get one reminder this many days before the round ends. */
export const POST_REMINDER_DAYS = 3
/** Version of the rules and consent texts accepted at sign-up (date of the rules). */
export const CONSENT_VERSION = '2026-10-02'

export const BUSINESS_FORMS = ['SRL', 'PFA', 'Întreprindere individuală', 'Întreprindere familială', 'ONG', 'Altă formă'] as const
export type BusinessForm = (typeof BUSINESS_FORMS)[number]

const TIME_ZONE = 'Europe/Bucharest'

/** Sign-ups need the database, the link-signing secret and Resend (confirmation e-mail). */
export function isContestConfigured() {
  return Boolean(process.env.DATABASE_URL && process.env.CONTEST_SECRET && process.env.RESEND_API_KEY)
}

function dateParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date)
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value)
  return { year: value('year'), month: value('month'), day: value('day') }
}

const roundId = (year: number, month: number) => `${year}-${String(month).padStart(2, '0')}`

/** Round of a date, as YYYY-MM in Romanian time. */
export function roundOf(date = new Date()) {
  const { year, month } = dateParts(date)
  return roundId(year, month)
}

export function dayOfRound(date = new Date()) {
  return dateParts(date).day
}

export function shiftRound(round: string, months: number) {
  const [year, month] = round.split('-').map(Number)
  const index = year * 12 + (month - 1) + months
  return roundId(Math.floor(index / 12), (index % 12) + 1)
}

export function daysInRound(round: string) {
  const [year, month] = round.split('-').map(Number)
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

/** "octombrie 2026" / "October 2026". Defaults to Romanian so cron emails stay unchanged. */
export function roundLabel(round: string, locale: Locale = 'ro') {
  const [year, month] = round.split('-').map(Number)
  return new Intl.DateTimeFormat(intlLocale(locale), { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, 15)))
}

/** "31 octombrie 2026, ora 23:59" / "31 October 2026, 23:59". */
export function roundEndLabel(round: string, locale: Locale = 'ro') {
  const label = roundLabel(round, locale)
  return locale === 'en' ? `${daysInRound(round)} ${label}, 23:59` : `${daysInRound(round)} ${label}, ora 23:59`
}
