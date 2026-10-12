import type { ReactNode } from 'react'

/**
 * A section's opening: a mono label with a brass number, a large title that
 * ends on a full stop, and an optional short intro to its right.
 */
export default function SectionHead({
  index,
  label,
  title,
  intro,
  id,
  as: Tag = 'h2',
  compact = false,
}: {
  index?: string
  label?: string
  title: string
  intro?: ReactNode
  id?: string
  as?: 'h2' | 'h3'
  /** Smaller title, for a head that sits in a narrow column. */
  compact?: boolean
}) {
  return (
    <div className={compact ? 'grid gap-8' : 'grid gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-end'}>
      <div>
        {label ? (
          <p className="mono-label flex items-center gap-3 text-[var(--fg-3)]">
            {index ? <span className="text-[var(--accent)]">{index}</span> : null}
            <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
            {label}
          </p>
        ) : null}
        <Tag id={id} className={`section-title display-xl mt-6 ${compact ? 'section-title-sm' : ''}`}>
          {title}
        </Tag>
      </div>
      {intro ? <div className="section-intro md:justify-self-end">{intro}</div> : null}
    </div>
  )
}
