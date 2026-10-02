import { createHash } from 'node:crypto'
import { getAllPosts } from '@/lib/blog'
import { escapeHtml, fromAddress, resendClient } from '@/lib/email'
import { EMAIL, absoluteUrl } from '@/lib/site'
import {
  CLAIM_DAYS,
  CONSENT_VERSION,
  CONTEST_PATH,
  POST_REMINDER_DAYS,
  dayOfRound,
  daysInRound,
  isContestConfigured,
  roundLabel,
  roundOf,
  shiftRound,
  type BusinessForm,
} from './config'
import { ensureSchema, sql } from './db'
import { contestMails, sendMails, type Mail } from './emails'
import { signToken } from './tokens'

const DAY_MS = 24 * 60 * 60 * 1000
const MAX_SIGNUPS_PER_IP_PER_DAY = 5

export type SignupInput = {
  name: string
  email: string
  phone: string
  businessName: string
  businessForm: BusinessForm
  activity: string
  city: string
  siteGoal: string
  postUrl: string
  marketing: boolean
}

export const contestLinks = {
  confirm: (entrantId: string) => absoluteUrl(`${CONTEST_PATH}/confirmare?t=${signToken('confirm', entrantId, 3)}`),
  manage: (entrantId: string) => absoluteUrl(`${CONTEST_PATH}/participare?t=${signToken('manage', entrantId, 400)}`),
  claim: (entryId: string) => absoluteUrl(`${CONTEST_PATH}/castig?t=${signToken('claim', entryId, CLAIM_DAYS + 1)}`),
  adminLikes: (round: string) => absoluteUrl(`${CONTEST_PATH}/admin/like-uri?t=${signToken('admin-likes', round, 30)}`),
  adminDelivered: (round: string) => absoluteUrl(`${CONTEST_PATH}/admin/livrat?t=${signToken('admin-delivered', round, 180)}`),
}

/** A public Instagram or Facebook post link, normalised to https; null for anything else. */
export function normalizePostUrl(value: string) {
  try {
    const url = new URL(/^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`)
    const host = url.hostname.toLowerCase().replace(/^(www|m|web)\./, '')
    const isInstagramPost = host === 'instagram.com' && /\/(p|reel|reels|tv)\/[\w-]+/.test(url.pathname)
    const isFacebookPost = ['facebook.com', 'fb.com', 'fb.watch'].includes(host) && url.pathname.length > 1
    if (!isInstagramPost && !isFacebookPost) return null
    url.protocol = 'https:'
    url.hash = ''
    return url.toString()
  } catch {
    return null
  }
}

function ipHash(ip: string) {
  return createHash('sha256').update(`${ip}|${process.env.CONTEST_SECRET}`).digest('hex').slice(0, 32)
}

// ---------------------------------------------------------------------------
// Sign-up, confirmation and the entrant's participation page

export async function registerEntrant(input: SignupInput, ip: string) {
  await ensureSchema()
  const db = sql()
  const email = input.email.toLowerCase()
  const hash = ipHash(ip)

  const [{ count }] = await db<{ count: number }[]>`
    select count(*)::int as count from contest_entrants where ip_hash = ${hash} and created_at > now() - interval '1 day'`
  if (count >= MAX_SIGNUPS_PER_IP_PER_DAY) return 'rate-limited' as const

  const [existing] = await db<{ id: string; name: string; confirmed_at: Date | null; withdrawn_at: Date | null }[]>`
    select id, name, confirmed_at, withdrawn_at from contest_entrants where email = ${email}`
  if (existing?.confirmed_at && !existing.withdrawn_at) {
    await sendMails([contestMails.alreadyRegistered(email, existing.name, contestLinks.manage(existing.id))])
    return 'already-confirmed' as const
  }

  // A new sign-up, an unconfirmed retry or a returning entrant who withdrew:
  // store the latest details and ask for (re)confirmation.
  const [entrant] = await db<{ id: string }[]>`
    insert into contest_entrants
      (email, name, phone, business_name, business_form, activity, city, site_goal, initial_post_url, marketing_consent, consent_version, ip_hash)
    values
      (${email}, ${input.name}, ${input.phone || null}, ${input.businessName}, ${input.businessForm}, ${input.activity}, ${input.city},
       ${input.siteGoal || null}, ${input.postUrl || null}, ${input.marketing}, ${CONSENT_VERSION}, ${hash})
    on conflict (email) do update set
      name = excluded.name, phone = excluded.phone, business_name = excluded.business_name,
      business_form = excluded.business_form, activity = excluded.activity, city = excluded.city,
      site_goal = excluded.site_goal, initial_post_url = excluded.initial_post_url,
      marketing_consent = excluded.marketing_consent, consent_version = excluded.consent_version,
      confirmed_at = null, withdrawn_at = null
    returning id`

  const sent = await sendMails([contestMails.confirm(email, input.name, input.businessName, contestLinks.confirm(entrant.id))])
  return sent ? ('confirm-sent' as const) : ('email-failed' as const)
}

async function addNewsletterContact(email: string, name: string) {
  const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID
  const resend = resendClient()
  if (!segmentId || !resend) return
  try {
    const { error } = await resend.contacts.create({ email, firstName: name.trim().split(/\s+/)[0], segments: [{ id: segmentId }] })
    if (error) console.warn('[concurs] Contactul nu a fost adăugat la newsletter:', error.message)
  } catch (error) {
    console.warn('[concurs] Contactul nu a fost adăugat la newsletter:', error)
  }
}

/** Confirms the e-mail address and enters the current round. Returns the entrant id, or null. */
export async function confirmEntrant(entrantId: string) {
  await ensureSchema()
  const db = sql()
  const [entrant] = await db<{ id: string; email: string; name: string; initial_post_url: string | null; marketing_consent: boolean; confirmed_at: Date | null }[]>`
    select id, email, name, initial_post_url, marketing_consent, confirmed_at from contest_entrants where id = ${entrantId}`
  if (!entrant) return null
  if (entrant.confirmed_at) return entrant.id

  const round = roundOf()
  await db`update contest_entrants set confirmed_at = now(), withdrawn_at = null where id = ${entrant.id}`
  await db`
    insert into contest_entries (entrant_id, round, post_url, post_submitted_at)
    values (${entrant.id}, ${round}, ${entrant.initial_post_url}, ${entrant.initial_post_url ? new Date() : null})
    on conflict (entrant_id, round) do nothing`

  if (entrant.marketing_consent) await addNewsletterContact(entrant.email, entrant.name)
  await sendMails([contestMails.welcome(entrant.email, entrant.name, round, contestLinks.manage(entrant.id))])
  return entrant.id
}

export type Participation = {
  name: string
  businessName: string
  withdrawn: boolean
  hasWon: boolean
  round: string
  entry: { postUrl: string | null; status: string } | null
}

export async function getParticipation(entrantId: string): Promise<Participation | null> {
  await ensureSchema()
  const db = sql()
  const [entrant] = await db<{ name: string; business_name: string; confirmed_at: Date | null; withdrawn_at: Date | null }[]>`
    select name, business_name, confirmed_at, withdrawn_at from contest_entrants where id = ${entrantId}`
  if (!entrant?.confirmed_at) return null

  const round = roundOf()
  const [entry] = await db<{ post_url: string | null; status: string }[]>`
    select post_url, status from contest_entries where entrant_id = ${entrantId} and round = ${round}`
  const [{ won }] = await db<{ won: boolean }[]>`
    select exists (select 1 from contest_entries where entrant_id = ${entrantId} and status in ('selected', 'winner')) as won`

  return {
    name: entrant.name,
    businessName: entrant.business_name,
    withdrawn: Boolean(entrant.withdrawn_at),
    hasWon: won,
    round,
    entry: entry ? { postUrl: entry.post_url, status: entry.status } : null,
  }
}

/** Saves the post link for the current round (joining it if needed). */
export async function savePost(entrantId: string, postUrl: string) {
  const participation = await getParticipation(entrantId)
  if (!participation || participation.withdrawn) return 'not-allowed' as const
  if (participation.hasWon) return 'already-won' as const
  if (participation.entry && !['active', 'withdrawn'].includes(participation.entry.status)) return 'not-allowed' as const

  await sql()`
    insert into contest_entries (entrant_id, round, post_url, post_submitted_at)
    values (${entrantId}, ${participation.round}, ${postUrl}, now())
    on conflict (entrant_id, round) do update set
      post_url = excluded.post_url,
      post_submitted_at = case when contest_entries.post_url is distinct from excluded.post_url then now() else contest_entries.post_submitted_at end,
      status = 'active'`
  return 'saved' as const
}

export async function withdrawEntrant(entrantId: string) {
  await ensureSchema()
  const db = sql()
  await db`update contest_entrants set withdrawn_at = now() where id = ${entrantId} and confirmed_at is not null`
  await db`update contest_entries set status = 'withdrawn' where entrant_id = ${entrantId} and round = ${roundOf()} and status = 'active'`
}

/** Re-activates an entrant who withdrew, for the current round. */
export async function rejoin(entrantId: string) {
  await ensureSchema()
  const db = sql()
  await db`update contest_entrants set withdrawn_at = null where id = ${entrantId} and confirmed_at is not null`
  await db`
    insert into contest_entries (entrant_id, round) values (${entrantId}, ${roundOf()})
    on conflict (entrant_id, round) do update set status = 'active' where contest_entries.status = 'withdrawn'`
}

// ---------------------------------------------------------------------------
// Rounds: closing, reminders, likes and the winner

type RankedEntry = { id: string; likes: number; post_url: string; email: string; name: string; business_name: string }

async function ranking(round: string) {
  return sql()<RankedEntry[]>`
    select e.id, e.likes, e.post_url, p.email, p.name, p.business_name
    from contest_entries e join contest_entrants p on p.id = e.entrant_id
    where e.round = ${round} and e.status = 'active' and e.post_url is not null and e.likes is not null and p.withdrawn_at is null
    order by e.likes desc, e.post_submitted_at asc nulls last, e.created_at asc`
}

/** Closes every finished round once and sends the admin the link to record likes. */
async function closeFinishedRounds(now: Date, mails: Mail[]) {
  const db = sql()
  const current = roundOf(now)
  const rounds = await db<{ round: string }[]>`
    select distinct e.round from contest_entries e left join contest_rounds r on r.round = e.round
    where e.round < ${current} and r.closed_at is null`

  for (const { round } of rounds) {
    const closed = await db`
      insert into contest_rounds (round, closed_at) values (${round}, now())
      on conflict (round) do update set closed_at = now() where contest_rounds.closed_at is null
      returning round`
    if (closed.length === 0) continue
    const [{ count }] = await db<{ count: number }[]>`
      select count(*)::int as count from contest_entries e join contest_entrants p on p.id = e.entrant_id
      where e.round = ${round} and e.status = 'active' and e.post_url is not null and p.withdrawn_at is null`
    mails.push(contestMails.roundClosedAdmin(round, count, contestLinks.adminLikes(round)))
  }
  return rounds.length
}

async function remindMissingPosts(now: Date, mails: Mail[]) {
  const round = roundOf(now)
  const daysLeft = daysInRound(round) - dayOfRound(now)
  if (daysLeft < 1 || daysLeft > POST_REMINDER_DAYS) return 0

  const entrants = await sql()<{ id: string; email: string; name: string }[]>`
    update contest_entries e set reminded_at = now()
    from contest_entrants p
    where p.id = e.entrant_id and e.round = ${round} and e.post_url is null and e.reminded_at is null
      and e.status = 'active' and p.confirmed_at is not null and p.withdrawn_at is null
    returning p.id, p.email, p.name`
  for (const entrant of entrants) mails.push(contestMails.reminder(entrant.email, entrant.name, round, contestLinks.manage(entrant.id), daysLeft))
  return entrants.length
}

function selectWinner(round: string, winner: RankedEntry, mails: Mail[]) {
  const deadline = new Date(Date.now() + CLAIM_DAYS * DAY_MS)
  mails.push(contestMails.winner(winner.email, winner.name, round, contestLinks.claim(winner.id), deadline))
  mails.push(contestMails.winnerSelectedAdmin(round, winner.business_name, winner.email, winner.post_url, winner.likes))
  return deadline
}

/** Passes unclaimed prizes to the next post in the ranking once the claim period ends. */
async function expireUnclaimedPrizes(now: Date, mails: Mail[]) {
  const db = sql()
  const expired = await db<{ round: string; winner_entry_id: string; business_name: string }[]>`
    select r.round, r.winner_entry_id, p.business_name
    from contest_rounds r join contest_entries e on e.id = r.winner_entry_id join contest_entrants p on p.id = e.entrant_id
    where r.claimed_at is null and r.claim_deadline < ${now}`

  for (const { round, winner_entry_id, business_name } of expired) {
    await db`update contest_entries set status = 'expired' where id = ${winner_entry_id}`
    const [next] = await ranking(round)
    if (next) {
      await db`update contest_entries set status = 'selected' where id = ${next.id}`
      const deadline = selectWinner(round, next, mails)
      await db`update contest_rounds set winner_entry_id = ${next.id}, claim_deadline = ${deadline} where round = ${round}`
    } else {
      await db`update contest_rounds set winner_entry_id = null, claim_deadline = null where round = ${round}`
    }
    mails.push(contestMails.claimExpiredAdmin(round, business_name, next?.business_name ?? null))
  }
  return expired.length
}

async function createNewsletterDraft(now: Date, mails: Mail[]) {
  const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID
  const resend = resendClient()
  if (!segmentId || !resend || dayOfRound(now) < 2) return false

  const current = roundOf(now)
  const previous = shiftRound(current, -1)
  const db = sql()
  const marked = await db`
    insert into contest_rounds (round, newsletter_draft_at) values (${previous}, now())
    on conflict (round) do update set newsletter_draft_at = now() where contest_rounds.newsletter_draft_at is null
    returning round`
  if (marked.length === 0) return false

  const posts = getAllPosts().slice(0, 3)
  const postList = posts.map((post) => `<li><a href="${absoluteUrl(`/blog/${post.slug}`)}">${escapeHtml(post.title)}</a></li>`).join('')
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1714">
    <p>Bună,</p>
    <p>Iată ce am publicat recent în ghidul MAST Studio:</p>
    <ul>${postList}</ul>
    <p>Concursul lunii continuă: în ${escapeHtml(roundLabel(current))} construim gratuit un site de prezentare pentru postarea cu cele mai multe aprecieri. <a href="${absoluteUrl(CONTEST_PATH)}">Vezi cum participi</a>.</p>
    <p>Echipa MAST Studio</p>
    <p style="font-size:12px;color:#6b645c">Primești acest e-mail pentru că te-ai abonat la noutățile MAST Studio. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Dezabonează-te</a>.</p>
  </div>`

  try {
    const { error } = await resend.broadcasts.create({
      segmentId,
      name: `Newsletter ${roundLabel(current)}`,
      from: fromAddress('noutati'),
      replyTo: EMAIL,
      subject: `Ghiduri noi și concursul din ${roundLabel(current)}`,
      html,
    })
    if (error) throw new Error(error.message)
    mails.push(contestMails.newsletterDraftAdmin(current))
    return true
  } catch (error) {
    console.error('[concurs] Draftul de newsletter nu a putut fi creat:', error)
    await db`update contest_rounds set newsletter_draft_at = null where round = ${previous}`
    return false
  }
}

/**
 * Retention from the rules: unconfirmed sign-ups go after 7 days; everyone
 * else 12 months after their last round. Winners stay for tax records.
 */
async function purgeOldData(now: Date) {
  const db = sql()
  const unconfirmed = await db`
    delete from contest_entrants where confirmed_at is null and created_at < ${new Date(now.getTime() - 7 * DAY_MS)} returning id`
  const inactive = await db`
    delete from contest_entrants p
    where p.confirmed_at is not null and not exists (
      select 1 from contest_entries e
      where e.entrant_id = p.id and (e.status in ('selected', 'winner') or e.round >= ${shiftRound(roundOf(now), -12)})
    ) and p.confirmed_at < ${new Date(now.getTime() - 365 * DAY_MS)}
    returning id`
  return unconfirmed.length + inactive.length
}

/** Runs once a day from Vercel Cron. Every step is idempotent, so a missed or repeated run is safe. */
export async function runDailyJobs(now = new Date()) {
  await ensureSchema()
  const mails: Mail[] = []
  const report = {
    closedRounds: await closeFinishedRounds(now, mails),
    reminders: await remindMissingPosts(now, mails),
    expiredClaims: await expireUnclaimedPrizes(now, mails),
    newsletterDraft: await createNewsletterDraft(now, mails),
    purgedEntrants: await purgeOldData(now),
  }
  return { ...report, emailsSent: await sendMails(mails) }
}

// ---------------------------------------------------------------------------
// Admin pages (reached through signed links in the admin's e-mails)

export type AdminEntry = { id: string; postUrl: string; likes: number | null; status: string; businessName: string; name: string; city: string }

export async function getRoundForAdmin(round: string) {
  await ensureSchema()
  const db = sql()
  const [info] = await db<{ closed_at: Date | null; likes_recorded_at: Date | null; winner_entry_id: string | null; claimed_at: Date | null }[]>`
    select closed_at, likes_recorded_at, winner_entry_id, claimed_at from contest_rounds where round = ${round}`
  const rows = await db<{ id: string; post_url: string; likes: number | null; status: string; business_name: string; name: string; city: string }[]>`
    select e.id, e.post_url, e.likes, e.status, p.business_name, p.name, p.city
    from contest_entries e join contest_entrants p on p.id = e.entrant_id
    where e.round = ${round} and e.post_url is not null and e.status <> 'withdrawn' and p.withdrawn_at is null
    order by e.post_submitted_at asc nulls last`
  const entries: AdminEntry[] = rows.map((row) => ({
    id: row.id,
    postUrl: row.post_url,
    likes: row.likes,
    status: row.status,
    businessName: row.business_name,
    name: row.name,
    city: row.city,
  }))
  return { closed: Boolean(info?.closed_at), recorded: Boolean(info?.likes_recorded_at), winnerId: info?.winner_entry_id ?? null, claimed: Boolean(info?.claimed_at), entries }
}

/** Saves the like counts, picks the winner and notifies everyone. Runs once per round. */
export async function recordLikes(round: string, values: Array<{ id: string; likes: number | null; invalid: boolean }>) {
  await ensureSchema()
  const db = sql()
  const [info] = await db<{ closed_at: Date | null; likes_recorded_at: Date | null }[]>`
    select closed_at, likes_recorded_at from contest_rounds where round = ${round}`
  if (!info?.closed_at) return 'not-closed' as const
  if (info.likes_recorded_at) return 'already-recorded' as const

  await db.begin(async (tx) => {
    for (const value of values) {
      await tx`
        update contest_entries set likes = ${value.likes}, status = ${value.invalid ? 'invalid' : 'active'}
        where id = ${value.id} and round = ${round} and status in ('active', 'invalid')`
    }
  })

  const ranked = await ranking(round)
  const audit = { recordedAt: new Date().toISOString(), ranking: ranked.map((entry) => ({ id: entry.id, likes: entry.likes })), invalid: values.filter((value) => value.invalid).map((value) => value.id) }
  const mails: Mail[] = []
  const winner = ranked[0]

  if (!winner) {
    await db`update contest_rounds set likes_recorded_at = now(), audit = ${db.json(audit)} where round = ${round}`
    return 'no-winner' as const
  }

  await db`update contest_entries set status = 'selected' where id = ${winner.id}`
  const deadline = selectWinner(round, winner, mails)
  await db`
    update contest_rounds set likes_recorded_at = now(), winner_entry_id = ${winner.id}, claim_deadline = ${deadline}, audit = ${db.json(audit)}
    where round = ${round}`

  const others = await db<{ entrant_id: string; email: string; name: string }[]>`
    select e.entrant_id, p.email, p.name from contest_entries e join contest_entrants p on p.id = e.entrant_id
    where e.round = ${round} and e.id <> ${winner.id} and e.post_url is not null and e.status in ('active', 'invalid') and p.withdrawn_at is null`
  for (const other of others) mails.push(contestMails.notSelected(other.email, other.name, round, contestLinks.manage(other.entrant_id)))

  await sendMails(mails)
  return 'winner-selected' as const
}

export async function markDelivered(round: string, url: string) {
  await ensureSchema()
  const updated = await sql()`
    update contest_rounds set delivered_at = now(), delivered_url = ${url}
    where round = ${round} and claimed_at is not null
    returning round`
  return updated.length > 0
}

export async function getDelivery(round: string) {
  await ensureSchema()
  const [row] = await sql()<{ business_name: string; claimed_at: Date | null; delivered_url: string | null }[]>`
    select p.business_name, r.claimed_at, r.delivered_url
    from contest_rounds r join contest_entries e on e.id = r.winner_entry_id join contest_entrants p on p.id = e.entrant_id
    where r.round = ${round}`
  return row ? { businessName: row.business_name, claimed: Boolean(row.claimed_at), deliveredUrl: row.delivered_url } : null
}

// ---------------------------------------------------------------------------
// Prize claim (winner)

export async function getClaim(entryId: string) {
  await ensureSchema()
  const [row] = await sql()<{ round: string; name: string; email: string; business_name: string; claim_deadline: Date | null; claimed_at: Date | null; winner_entry_id: string | null }[]>`
    select e.round, p.name, p.email, p.business_name, r.claim_deadline, r.claimed_at, r.winner_entry_id
    from contest_entries e join contest_entrants p on p.id = e.entrant_id join contest_rounds r on r.round = e.round
    where e.id = ${entryId}`
  if (!row || row.winner_entry_id !== entryId) return null
  return {
    round: row.round,
    name: row.name,
    email: row.email,
    businessName: row.business_name,
    deadline: row.claim_deadline,
    claimed: Boolean(row.claimed_at),
    expired: !row.claimed_at && Boolean(row.claim_deadline && row.claim_deadline.getTime() < Date.now()),
  }
}

export async function claimPrize(entryId: string, brief: Record<string, string>, publishConsent: boolean) {
  const claim = await getClaim(entryId)
  if (!claim) return 'invalid' as const
  if (claim.claimed) return 'already-claimed' as const
  if (claim.expired) return 'expired' as const

  const db = sql()
  const updated = await db`
    update contest_rounds set claimed_at = now(), claim_brief = ${db.json(brief)}, publish_consent = ${publishConsent}
    where round = ${claim.round} and winner_entry_id = ${entryId} and claimed_at is null
    returning round`
  if (updated.length === 0) return 'already-claimed' as const
  await db`update contest_entries set status = 'winner' where id = ${entryId}`

  await sendMails([
    contestMails.claimReceivedAdmin(claim.round, claim.businessName, claim.email, brief, contestLinks.adminDelivered(claim.round)),
    contestMails.claimConfirmed(claim.email, claim.name),
  ])
  return 'claimed' as const
}

// ---------------------------------------------------------------------------
// Public page

export type PublicWinner = { round: string; businessName: string; city: string; url: string | null }

/** Winners who accepted publication, newest first. Empty when the contest is not configured. */
export async function publicWinners(): Promise<PublicWinner[]> {
  if (!isContestConfigured()) return []
  try {
    await ensureSchema()
    const rows = await sql()<{ round: string; business_name: string; city: string; delivered_url: string | null }[]>`
      select r.round, p.business_name, p.city, r.delivered_url
      from contest_rounds r join contest_entries e on e.id = r.winner_entry_id join contest_entrants p on p.id = e.entrant_id
      where r.claimed_at is not null and r.publish_consent
      order by r.round desc limit 12`
    return rows.map((row) => ({ round: row.round, businessName: row.business_name, city: row.city, url: row.delivered_url }))
  } catch (error) {
    console.error('[concurs] Câștigătorii nu au putut fi citiți:', error)
    return []
  }
}
