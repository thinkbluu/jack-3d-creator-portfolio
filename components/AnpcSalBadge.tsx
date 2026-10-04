'use client'

import { ANPC_SAL_URL } from '@/lib/site'
import { useUi } from '@/lib/i18n/context'

/**
 * Link to the ANPC alternative dispute resolution platform, at the 250×50 size
 * required by Ordinul ANPC 449/2022 (modified by Ordinul 270/2026). Shown in
 * the footer. When the official pictogram from anpc.ro is available, render it
 * here instead of the drawn badge.
 */
export default function AnpcSalBadge({ className = '' }: { className?: string }) {
  const copy = useUi().anpc
  return (
    <a
      href={ANPC_SAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`h-[50px] w-[250px] shrink-0 gap-3 whitespace-normal rounded-md border border-[#1d3f8a] bg-white px-3 text-left font-sans text-[#1d3f8a] transition-colors hover:bg-[#f2f5fb] ${className}`}
    >
      <span className="text-[17px] font-extrabold tracking-[0.04em]">ANPC</span>
      <span className="flex flex-col border-l border-[#1d3f8a]/30 pl-3 leading-tight">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em]">SAL</span>
        <span className="text-[10.5px] font-medium">{copy.line}</span>
      </span>
      <span className="sr-only"> {copy.newTab}</span>
    </a>
  )
}
