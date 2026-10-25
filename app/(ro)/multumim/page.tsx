// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import SiteHeader from '@/components/SiteHeader'
import ThankYouView from '@/components/ThankYouView'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { pageMetadata } from '@/lib/seo'

const copy = ui.ro.thanks

// Conversion page: hidden from search engines, still crawlable so the
// noindex is visible (never blocked in robots.txt). Left out of the sitemap.
export const metadata: Metadata = {
  ...pageMetadata({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: localizePath('/multumim', 'ro'),
    locale: 'ro',
  }),
  robots: { index: false, follow: false },
}

export default function MultumimPage() {
  return (
    <>
      <SiteHeader />
      <ThankYouView locale="ro" />
      <Footer />
    </>
  )
}
