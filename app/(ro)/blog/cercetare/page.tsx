import { researchMetadata, ResearchView } from './view'

export const metadata = researchMetadata('ro')

export default function Page() {
  return <ResearchView locale="ro" />
}
