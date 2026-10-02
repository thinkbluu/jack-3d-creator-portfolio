type RateLimitEntry = {
  count: number
  resetAt: number
}

// Kept in memory, so the limit applies per server instance. Enough to stop
// casual form flooding; the forms also use a hidden honeypot field.
const rateLimits = new Map<string, RateLimitEntry>()

export function clientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  return forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

/** Fixed-window limit: true once `key` has been seen more than `max` times in `windowMs`. */
export function isRateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now()
  const current = rateLimits.get(key)

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  current.count += 1
  return current.count > max
}

/** 303 redirect after a form POST, to a path on the same site. */
export function seeOther(request: Request, path: string) {
  return Response.redirect(new URL(path, request.url), 303)
}
