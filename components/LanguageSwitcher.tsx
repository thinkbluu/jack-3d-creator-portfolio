'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { alternatePublicPath } from '@/lib/i18n/paths'
import { useLocale, useUi } from '@/lib/i18n/context'

function SwitcherLinks() {
  const locale = useLocale()
  const pathname = usePathname() || '/'
  const search = useSearchParams()
  const { switcher } = useUi()
  const query = search.toString()
  const current = query ? `${pathname}?${query}` : pathname
  const other = alternatePublicPath(current)
  const roHref = locale === 'ro' ? pathname : other
  const enHref = locale === 'en' ? pathname : other

  const item = (active: boolean) =>
    `px-1.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${active ? 'text-[var(--ink)]' : 'text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]'}`

  return (
    <div className="flex items-center gap-1" role="navigation" aria-label={switcher.label}>
      <Link href={roHref} hrefLang="ro" lang="ro" aria-current={locale === 'ro' ? 'true' : undefined} className={item(locale === 'ro')}>
        {switcher.ro}
      </Link>
      <span aria-hidden="true" className="text-[var(--ink-3)]">/</span>
      <Link href={enHref} hrefLang="en" lang="en" aria-current={locale === 'en' ? 'true' : undefined} className={item(locale === 'en')}>
        {switcher.en}
      </Link>
    </div>
  )
}

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { switcher } = useUi()
  return (
    <Suspense fallback={<span className={`text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-2)] ${className}`}>{switcher.ro} / {switcher.en}</span>}>
      <span className={className}>
        <SwitcherLinks />
      </span>
    </Suspense>
  )
}
