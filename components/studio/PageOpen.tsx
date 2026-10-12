import type { CSSProperties, ReactNode } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import type { BreadcrumbItem } from '@/lib/schema'

/**
 * Opening of an inner page, in the homepage's voice: one or two words set as
 * large as the screen allows, ending on a full stop ("Lucrări."), with the
 * descriptive, search-friendly title kept as the h1 in a mono line above it.
 * The lead sits under the big word, like the homepage greeting.
 */
export default function PageOpen({
  crumbs,
  index,
  title,
  word,
  lead,
  tone = 'dark',
  short = false,
  children,
}: {
  crumbs?: BreadcrumbItem[]
  /** Small brass number before the title, as on the homepage ("01"). */
  index?: string
  /** Descriptive page title, kept as the h1 for search. */
  title: string
  /** The big word, with its full stop. */
  word: string
  lead?: ReactNode
  tone?: 'dark' | 'cream'
  /** Shorter opening for pages that get to their content quickly. */
  short?: boolean
  children?: ReactNode
}) {
  return (
    <section className={`page-open tone-${tone} relative`} data-short={short ? '' : undefined}>
      <div className="studio-container page-open-inner relative flex flex-col justify-between gap-12">
        <div className="flex flex-col gap-6">
          {crumbs ? <Breadcrumbs items={crumbs} className="page-open-crumbs" /> : null}
          <h1 className="mono-label flex items-center gap-3 text-[var(--fg-3)]">
            {index ? <span className="text-[var(--accent)]">{index}</span> : null}
            <span aria-hidden="true" className="h-px w-8 shrink-0 bg-current opacity-40" />
            <span>{title}</span>
          </h1>
        </div>
        <div>
          <p aria-hidden="true" className="page-big display-xl" style={{ '--len': word.length } as CSSProperties}>
            {word}
          </p>
          {lead || children ? (
            <div className="page-open-foot mt-[clamp(1.25rem,3svh,2.25rem)] grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end">
              {lead ? <div className="page-lead">{lead}</div> : <span />}
              {children ? <div className="page-open-aside md:justify-self-end">{children}</div> : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
