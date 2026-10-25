import { ui } from '@/lib/i18n/ui'
import { OG_SIZE, renderOgImage } from '@/lib/og'
import { homeMetaOffer, isNoDepositActive } from '@/lib/offer'

const copy = ui.en.meta

export const alt = copy.ogAlt
export const size = OG_SIZE
export const contentType = 'image/png'
// Re-evaluate the offer switch at request time instead of baking it at build.
export const dynamic = 'force-dynamic'

export default function OpenGraphImage() {
  return renderOgImage({
    kicker: copy.ogKicker,
    title: copy.ogTitle,
    subtitle: isNoDepositActive() ? homeMetaOffer.en.ogSubtitle : copy.ogSubtitle,
  })
}
