import { quoteMetadata, QuoteView } from '@/app/(ro)/cerere-oferta/view'

export const metadata = quoteMetadata('en')

export default function Page() {
  return <QuoteView locale="en" />
}
