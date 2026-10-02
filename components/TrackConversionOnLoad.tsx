'use client'

import { useEffect } from 'react'
import { trackConversion } from '@/lib/analytics'

/**
 * Counts one conversion for a page reached after a successful form post, then
 * drops the one-time `stare` flag from the address so a reload doesn't count it
 * again. Nothing is stored on the device.
 */
export default function TrackConversionOnLoad({ event }: { event: string }) {
  useEffect(() => {
    const url = new URL(window.location.href)
    if (!url.searchParams.has('stare')) return
    trackConversion(event)
    url.searchParams.delete('stare')
    window.history.replaceState(null, '', url)
  }, [event])

  return null
}
