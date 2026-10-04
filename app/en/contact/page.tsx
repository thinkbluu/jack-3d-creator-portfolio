import { contactMetadata, ContactView } from '@/app/(ro)/contact/page'

export const metadata = contactMetadata('en')

export default function Page() {
  return <ContactView locale="en" />
}
