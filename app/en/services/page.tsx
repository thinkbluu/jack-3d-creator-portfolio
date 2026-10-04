import { servicesMetadata, ServicesView } from '@/app/(ro)/servicii/page'

export const metadata = servicesMetadata('en')

export default function Page() {
  return <ServicesView locale="en" />
}
