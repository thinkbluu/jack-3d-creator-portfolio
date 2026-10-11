import { TermsView, termsMetadata } from '@/app/(ro)/termeni/view'

export const metadata = termsMetadata('en')

export default function Page() {
  return <TermsView locale="en" />
}
