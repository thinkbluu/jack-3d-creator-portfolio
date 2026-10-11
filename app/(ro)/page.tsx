import { homeMetadata, HomeView } from './view'

export const metadata = homeMetadata('ro')

export default function Page() {
  return <HomeView locale="ro" />
}
