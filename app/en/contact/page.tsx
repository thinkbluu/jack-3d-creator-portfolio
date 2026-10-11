import { contactMetadata, ContactView } from '@/app/(ro)/contact/view'

export const metadata = contactMetadata('en')

export default function Page() {
  return <ContactView locale="en" />
}
