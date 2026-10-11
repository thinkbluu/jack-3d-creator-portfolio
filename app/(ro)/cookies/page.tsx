import { cookiesMetadata, CookiesView } from './view'

export const metadata = cookiesMetadata('ro')

export default function CookiesPage() {
  return <CookiesView locale="ro" />
}
