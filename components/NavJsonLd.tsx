import JsonLd from '@/components/JsonLd'
import type { Locale } from '@/lib/i18n/locale'
import { buildNavTree } from '@/lib/nav-tree'

/**
 * SiteNavigationElement covering every link in the header tree (top level,
 * panel groups and the slim "more" rows). The site had no navigation
 * structured data before, so this is the only instance — no duplication.
 */
export default function NavJsonLd({ locale }: { locale: Locale }) {
  const names: string[] = []
  const urls: string[] = []
  for (const entry of buildNavTree(locale)) {
    names.push(entry.label)
    urls.push(entry.href)
    for (const group of entry.panel?.groups ?? []) {
      for (const child of group.children) {
        names.push(child.label)
        urls.push(child.href)
      }
    }
    for (const link of entry.panel?.more ?? []) {
      names.push(link.label)
      urls.push(link.href)
    }
  }
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'SiteNavigationElement',
        name: names,
        url: urls,
      }}
    />
  )
}
