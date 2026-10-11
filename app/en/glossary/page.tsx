import { glossaryMetadata, GlossaryView } from '@/app/(ro)/glosar/view'

export const metadata = glossaryMetadata('en')

export default function Page() {
  return <GlossaryView locale="en" />
}
