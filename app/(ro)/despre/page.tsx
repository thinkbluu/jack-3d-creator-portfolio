import { aboutMetadata, AboutView } from './view'

export const metadata = aboutMetadata('ro')

export default function AboutPage() {
  return <AboutView locale="ro" />
}
