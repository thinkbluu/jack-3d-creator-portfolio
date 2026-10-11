import Link from 'next/link'
import type { BreadcrumbItem } from '@/lib/schema'

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  className?: string
}

/** Visible breadcrumb trail. Pair it with `breadcrumbNode(items)` in the page's JSON-LD. */
export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`mono-label text-[var(--ink-3)] ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.path} className="flex items-center gap-x-2">
              {isLast ? (
                <span aria-current="page" className="text-[var(--ink)]">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className="underline-offset-4 hover:text-[var(--ink)] hover:underline">
                    {item.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
