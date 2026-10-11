import { privacyMetadata, PrivacyView } from './view'

export const metadata = privacyMetadata('ro')

export default function PrivacyPage() {
  return <PrivacyView locale="ro" />
}
