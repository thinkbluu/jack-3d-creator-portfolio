import { blogMetadata, BlogView } from '@/app/(ro)/blog/page'

export const metadata = blogMetadata('en')

export default function Page() {
  return <BlogView locale="en" />
}
