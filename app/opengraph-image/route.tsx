import { ui } from '@/lib/i18n/ui'
import { renderOgImage } from '@/lib/og'
import { homeMetaOffer, isNoDepositActive } from '@/lib/offer'

const copy = ui.ro.meta

export function GET() {
  return renderOgImage({
    kicker: copy.ogKicker,
    title: copy.ogTitle,
    subtitle: isNoDepositActive() ? homeMetaOffer.ro.ogSubtitle : copy.ogSubtitle,
  })
}
