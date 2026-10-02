'use client'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { withoutToken } from '@/lib/analytics'

/**
 * Vercel Analytics and Speed Insights: cookieless and loaded for every visitor.
 * Personal contest pages are reported without their access token.
 */
export default function VercelInsights() {
  return (
    <>
      <Analytics beforeSend={withoutToken} />
      <SpeedInsights beforeSend={withoutToken} />
    </>
  )
}
