'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { isPrivatePath, trackConversion } from '@/lib/analytics'
import { ADS_ID, ADS_WHATSAPP_SEND_TO, GA4_ID, TRACKING_ACTIVE, fireAdsConversion, saveAttributionFromUrl } from '@/lib/ads'

let configured = false

function configure() {
  if (configured) return
  configured = true
  window.gtag?.('js', new Date())
  if (GA4_ID) window.gtag?.('config', GA4_ID)
  if (ADS_ID) window.gtag?.('config', ADS_ID)
}

const WHATSAPP_HREF = /^https?:\/\/(wa\.me|api\.whatsapp\.com)(\/|$)/i

/**
 * Sitewide Google Ads tracking: loads gtag.js once (production only, Consent
 * Mode v2 defaults are already denied from the layout head), captures click
 * IDs from the address on every page, and owns one delegated click listener
 * for WhatsApp and phone links so links rendered later are covered too.
 */
export default function AdsTracking() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // First-party attribution capture runs everywhere, production or not: the
  // mockup form reads it even before ads measurement goes live.
  useEffect(() => {
    saveAttributionFromUrl()
  }, [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.('a[href]')
      if (!anchor) return
      const href = anchor.getAttribute('href') ?? ''
      // TrackedLink already sends its own richer event (placement, segment);
      // skip the generic duplicate but still count the Ads conversion.
      const alreadyTracked = Boolean(anchor.closest('[data-tracked-link]'))
      if (WHATSAPP_HREF.test(href)) {
        fireAdsConversion(ADS_WHATSAPP_SEND_TO)
        if (!alreadyTracked) trackConversion('whatsapp_click', { page_path: window.location.pathname })
      } else if (href.startsWith('tel:')) {
        if (!alreadyTracked) trackConversion('phone_click', { page_path: window.location.pathname })
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // Personal contest links carry an access token in their address; Google Tag
  // never loads there. `mounted` keeps the private-path check client-side.
  if (!TRACKING_ACTIVE || !mounted || isPrivatePath(pathname ?? '')) return null

  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ADS_ID || GA4_ID)}`} strategy="afterInteractive" onLoad={configure} onReady={configure} />
}
