import type { ReactNode } from 'react'
import type { BlogDataset, BlogSource } from '@/lib/blog'

export function DraftNotice({ children }: { children: ReactNode }) {
  return (
    <p className="draft-notice" role="status">
      {children}
    </p>
  )
}

export function SectionBadge({ children }: { children: ReactNode }) {
  return <span className="section-badge">{children}</span>
}

export function MethodologyBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="research-block" aria-labelledby="research-method">
      <h2 id="research-method" className="type-h3">
        {title}
      </h2>
      <div className="research-method">{children}</div>
    </section>
  )
}

export function SourcesBlock({ title, sources }: { title: string; sources: BlogSource[] }) {
  return (
    <section className="research-block" aria-labelledby="research-sources">
      <h2 id="research-sources" className="type-h3">
        {title}
      </h2>
      <ol className="research-sources">
        {sources.map((source) => (
          <li key={`${source.name}-${source.url ?? ''}`}>
            {source.url ? (
              <a href={source.url} rel="noopener noreferrer">
                {source.name}
              </a>
            ) : (
              <span>{source.name}</span>
            )}
            {source.note ? <span className="research-source-note">{source.note}</span> : null}
          </li>
        ))}
      </ol>
    </section>
  )
}

export function DatasetBlock({
  title,
  downloadLabel,
  dataset,
}: {
  title: string
  downloadLabel: string
  dataset: BlogDataset
}) {
  return (
    <section className="research-block" aria-labelledby="research-data">
      <h2 id="research-data" className="type-h3">
        {title}
      </h2>
      <div className="research-dataset">
        <p className="font-semibold text-[var(--ink)]">{dataset.name}</p>
        <p className="mt-2 text-[var(--ink-2)]">{dataset.description}</p>
        <a className="research-download" href={dataset.path} download>
          {downloadLabel}
          <span className="mono-label">CSV</span>
        </a>
      </div>
    </section>
  )
}

type ChartPoint = { label: string; value: number }

/** Horizontal bars for a study figure. Values come from the post, never from defaults. */
export function BarChart({
  title,
  caption,
  unit = '',
  emptyLabel = 'Fără valori.',
  data = [],
}: {
  title: string
  caption: string
  unit?: string
  emptyLabel?: string
  data?: ChartPoint[]
}) {
  const points = data.filter((item) => item && typeof item.label === 'string' && Number.isFinite(Number(item.value)))
  const max = points.reduce((peak, item) => Math.max(peak, item.value), 0)
  const hasValues = points.length > 0 && max > 0

  return (
    <figure className="research-figure">
      <figcaption>
        <span className="mono-label text-[var(--brass-ink)]">{title}</span>
        <span>{caption}</span>
      </figcaption>
      {hasValues ? (
        <ul className="research-bars" aria-label={title}>
          {points.map((item) => (
            <li key={item.label}>
              <span className="research-bar-label">{item.label}</span>
              <span className="research-bar-track" aria-hidden="true">
                <span className="research-bar-fill" style={{ width: `${(item.value / max) * 100}%` }} />
              </span>
              <span className="research-bar-value">
                {item.value}
                {unit}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="research-figure-empty">{emptyLabel}</p>
      )}
    </figure>
  )
}

export function Figure({ caption, children }: { caption: string; children?: ReactNode }) {
  return (
    <figure className="research-figure">
      {children ? <div className="research-figure-body">{children}</div> : null}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
