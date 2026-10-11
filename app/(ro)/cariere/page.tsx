import { careersMetadata, CareersView } from './view'

export const metadata = careersMetadata('ro')

export default function CareersPage() {
  return <CareersView locale="ro" />
}
