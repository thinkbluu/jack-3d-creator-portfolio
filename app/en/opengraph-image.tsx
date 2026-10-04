import { ui } from '@/lib/i18n/ui'
import { OG_SIZE, renderOgImage } from '@/lib/og'

const copy = ui.en.meta

export const alt = copy.ogAlt
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return renderOgImage({
    kicker: copy.ogKicker,
    title: copy.ogTitle,
    subtitle: copy.ogSubtitle,
  })
}
