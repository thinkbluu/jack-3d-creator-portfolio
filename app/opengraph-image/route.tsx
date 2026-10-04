import { ui } from '@/lib/i18n/ui'
import { renderOgImage } from '@/lib/og'

const copy = ui.ro.meta

export function GET() {
  return renderOgImage({
    kicker: copy.ogKicker,
    title: copy.ogTitle,
    subtitle: copy.ogSubtitle,
  })
}
