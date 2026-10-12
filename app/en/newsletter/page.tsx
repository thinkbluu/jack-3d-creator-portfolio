import { newsletterMetadata, NewsletterView } from '@/app/(ro)/newsletter/view'

export const metadata = newsletterMetadata('en')

export default function Page() {
  return <NewsletterView locale="en" />
}
