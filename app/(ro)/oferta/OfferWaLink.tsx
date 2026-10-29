'use client'

import type { MouseEvent, ReactNode } from 'react'
import TrackedLink from '@/components/TrackedLink'
import { ADS_WHATSAPP_SEND_TO, fireAdsConversion } from '@/lib/ads'

/**
 * WhatsApp link for the ad landing page: besides the sitewide analytics
 * event it fires the Google Ads WhatsApp conversion. Both calls are guarded
 * so tracking can never throw or block the navigation to WhatsApp.
 */
export default function OfferWaLink({
  href,
  placement,
  className,
  children,
}: {
  href: string
  placement: string
  className?: string
  children: ReactNode
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    try {
      fireAdsConversion(ADS_WHATSAPP_SEND_TO, { placement })
    } catch {
      // Never block the click because of tracking.
    }
  }

  return (
    <TrackedLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      eventName="whatsapp_click"
      eventProperties={{ placement }}
      onClick={handleClick}
      className={className}
    >
      {children}
    </TrackedLink>
  )
}
