import { servicesMetadata, ServicesView } from './view'

export const metadata = servicesMetadata('ro')

export default function Page() {
  return <ServicesView locale="ro" />
}
