import { aboutMetadata, AboutView } from '@/app/(ro)/despre/view'

export const metadata = aboutMetadata('en')

export default function Page() {
  return <AboutView locale="en" />
}
