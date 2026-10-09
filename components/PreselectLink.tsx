'use client'

import type { ReactNode } from 'react'

/**
 * Anchor to the mockup form that also asks the form to preselect a project
 * type (the Black Friday band preselects "Magazin online" this way).
 */
export default function PreselectLink({ type, className, children }: { type: 'magazin' | 'prezentare'; className?: string; children: ReactNode }) {
  return (
    <a
      href="#form"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent('mockup:preselect', { detail: type }))}
    >
      {children}
    </a>
  )
}
