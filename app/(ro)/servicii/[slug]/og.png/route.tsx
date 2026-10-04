import { ui } from '@/lib/i18n/ui'
import { renderOgImage } from '@/lib/og'
import { getAllServicePages, getServicePageBySlug } from '@/lib/services'

const locale = 'ro' as const

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return getAllServicePages(locale).map((service) => ({ slug: service.slug }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getServicePageBySlug(slug, locale)
  if (!service) return new Response('Not found', { status: 404 })
  return renderOgImage({
    kicker: ui[locale].nav.services,
    title: service.h1,
    subtitle: `${service.priceLabel} · ${service.deliveryTime}`,
  })
}
