import { contactMetadata, ContactView } from './view'

export const metadata = contactMetadata('ro')

export default function ContactPage() {
  return <ContactView locale="ro" />
}
