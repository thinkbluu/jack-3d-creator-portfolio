import { servicesMetadata, ServicesView } from '@/app/(ro)/servicii/view'

export const metadata = servicesMetadata('en')

export default function Page() {
  return <ServicesView locale="en" />
}
