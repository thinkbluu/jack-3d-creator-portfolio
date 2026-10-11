import { newsletterMetadata, NewsletterView } from './view'

export const metadata = newsletterMetadata('ro')

export default function NewsletterPage() {
  return <NewsletterView locale="ro" />
}
