import { renderOgImage } from '@/lib/og'
import { getAllServicePages, getServicePageBySlug } from '@/lib/services'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return getAllServicePages().map((service) => ({ slug: service.slug }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getServicePageBySlug(slug)
  if (!service) return new Response('Not found', { status: 404 })
  return renderOgImage({
    kicker: 'Servicii',
    title: service.h1,
    subtitle: `${service.priceLabel} · ${service.deliveryTime}`,
  })
}
