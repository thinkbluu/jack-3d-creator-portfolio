'use client'

import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { trackConversion } from '@/lib/analytics'

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName?: string
  eventProperties?: Record<string, string | number | boolean>
}

/**
 * Link that reports an explicit analytics event on click. Generic WhatsApp and
 * phone-link tracking is handled sitewide by the delegated listener in
 * AdsTracking — this component only adds its named event, and marks itself so
 * the listener does not double-count the same click.
 */
export default function TrackedLink({ eventName, eventProperties, onClick, ...props }: TrackedLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (eventName) trackConversion(eventName, eventProperties)
    onClick?.(event)
  }

  return <a {...props} data-tracked-link={eventName ? '' : undefined} onClick={handleClick} />
}
