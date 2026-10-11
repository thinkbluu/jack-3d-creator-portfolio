import { comparisonMetadata, ComparisonView } from '@/app/(ro)/comparatie/view'

export const metadata = comparisonMetadata('en')

export default function Page() {
  return <ComparisonView locale="en" />
}
