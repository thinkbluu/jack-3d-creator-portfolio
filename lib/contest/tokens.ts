import { createHmac, timingSafeEqual } from 'node:crypto'

// Signed links in contest e-mails, so entrants and the admin need no account.
// A token is `<base64url payload>.<HMAC-SHA256>` with a purpose and an expiry.

export type TokenPurpose = 'confirm' | 'manage' | 'claim' | 'admin-likes' | 'admin-delivered'

type TokenPayload = { p: TokenPurpose; id: string; exp: number }

const DAY_MS = 24 * 60 * 60 * 1000

function secret() {
  const value = process.env.CONTEST_SECRET
  if (!value || value.length < 32) throw new Error('CONTEST_SECRET must be set to at least 32 characters')
  return value
}

function signature(body: string) {
  return createHmac('sha256', secret()).update(body).digest('base64url')
}

export function signToken(purpose: TokenPurpose, id: string, validDays: number) {
  const payload: TokenPayload = { p: purpose, id, exp: Date.now() + validDays * DAY_MS }
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${signature(body)}`
}

/** Returns the id carried by a valid, unexpired token for `purpose`, otherwise null. */
export function verifyToken(token: string | null | undefined, purpose: TokenPurpose) {
  if (!token) return null
  const [body, mac] = token.split('.')
  if (!body || !mac) return null

  const expected = signature(body)
  if (mac.length !== expected.length || !timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload
    return payload.p === purpose && payload.exp > Date.now() && typeof payload.id === 'string' ? payload.id : null
  } catch {
    return null
  }
}
