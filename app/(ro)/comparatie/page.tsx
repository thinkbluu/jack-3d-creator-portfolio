import { comparisonMetadata, ComparisonView } from './view'

export const metadata = comparisonMetadata('ro')

export default function Page() {
  return <ComparisonView locale="ro" />
}
