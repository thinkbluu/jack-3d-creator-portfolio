import { PrivacyView, privacyMetadata } from '@/app/(ro)/confidentialitate/page'

export const metadata = privacyMetadata('en')

export default function Page() {
  return <PrivacyView locale="en" />
}
