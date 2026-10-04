import { careersMetadata, CareersView } from '@/app/(ro)/cariere/page'

export const metadata = careersMetadata('en')

export default function Page() {
  return <CareersView locale="en" />
}
