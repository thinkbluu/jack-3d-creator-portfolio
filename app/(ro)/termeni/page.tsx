import { termsMetadata, TermsView } from './view'

export const metadata = termsMetadata('ro')

export default function TermsPage() {
  return <TermsView locale="ro" />
}
