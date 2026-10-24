'use client'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

/**
 * Vercel Analytics and Speed Insights: cookieless and loaded for every visitor.
 */
export default function VercelInsights() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
