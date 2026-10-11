import { CookiesView, cookiesMetadata } from '@/app/(ro)/cookies/view'

export const metadata = cookiesMetadata('en')

export default function Page() {
  return <CookiesView locale="en" />
}
