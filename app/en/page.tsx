import { homeMetadata, HomeView } from '@/app/(ro)/page'

export const metadata = homeMetadata('en')

export default function Page() {
  return <HomeView locale="en" />
}
