import { quoteMetadata, QuoteView } from '@/app/(ro)/cerere-oferta/page'

export const metadata = quoteMetadata('en')

export default function Page() {
  return <QuoteView locale="en" />
}
