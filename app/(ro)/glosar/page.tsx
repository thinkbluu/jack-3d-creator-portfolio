import { glossaryMetadata, GlossaryView } from './view'

export const metadata = glossaryMetadata('ro')

export default function Page() {
  return <GlossaryView locale="ro" />
}
