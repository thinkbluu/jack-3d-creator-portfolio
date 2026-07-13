'use client'

import { track } from '@vercel/analytics'
import type { AnchorHTMLAttributes, MouseEvent } from 'react'

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string
  eventProperties?: Record<string, string | number | boolean>
}

export default function TrackedLink({ eventName, eventProperties, onClick, ...props }: TrackedLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    try {
      track(eventName, eventProperties)
    } catch {
      // Analytics must never block navigation.
    }
    onClick?.(event)
  }

  return <a {...props} onClick={handleClick} />
}
