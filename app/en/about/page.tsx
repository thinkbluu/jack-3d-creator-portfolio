import { aboutMetadata, AboutView } from '@/app/(ro)/despre/page'

export const metadata = aboutMetadata('en')

export default function Page() {
  return <AboutView locale="en" />
}
