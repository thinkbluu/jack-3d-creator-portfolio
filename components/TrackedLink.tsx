'use client'

import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { trackConversion } from '@/lib/analytics'

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName?: string
  eventProperties?: Record<string, string | number | boolean>
}

function inferEvent(href?: string): string | null {
  if (!href) return null
  if (/wa\.me|whatsapp/i.test(href)) return 'whatsapp_click'
  if (/^tel:/i.test(href)) return 'phone_click'
  return null
}

export default function TrackedLink({ eventName, eventProperties, onClick, ...props }: TrackedLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const resolved = eventName ?? inferEvent(props.href)
    if (resolved) trackConversion(resolved, eventProperties)
    onClick?.(event)
  }

  return <a {...props} onClick={handleClick} />
}
