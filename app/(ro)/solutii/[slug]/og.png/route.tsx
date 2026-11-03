import { getAllIndustries, getIndustryBySlug } from '@/lib/industries'
import { ui } from '@/lib/i18n/ui'
import { renderOgImage } from '@/lib/og'

const locale = 'ro' as const

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return getAllIndustries(locale).map((industry) => ({ slug: industry.slug }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const industry = getIndustryBySlug(slug, locale)
  if (!industry) return new Response('Not found', { status: 404 })
  return renderOgImage({
    kicker: ui[locale].nav.solutions,
    title: industry.h1,
    subtitle: industry.name,
  })
}
