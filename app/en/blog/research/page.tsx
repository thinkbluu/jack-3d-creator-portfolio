import { researchMetadata, ResearchView } from '@/app/(ro)/blog/cercetare/view'

export const metadata = researchMetadata('en')

export default function Page() {
  return <ResearchView locale="en" />
}
