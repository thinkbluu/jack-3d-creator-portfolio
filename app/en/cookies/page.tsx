import { CookiesView, cookiesMetadata } from '@/app/(ro)/cookies/page'

export const metadata = cookiesMetadata('en')

export default function Page() {
  return <CookiesView locale="en" />
}
