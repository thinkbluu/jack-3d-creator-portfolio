import { blogMetadata, BlogView } from './view'

export const metadata = blogMetadata('ro')

export default function Page() {
  return <BlogView locale="ro" />
}
