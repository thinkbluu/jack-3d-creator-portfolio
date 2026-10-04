import { FreeWebsiteView, freeWebsiteMetadata } from '@/app/(ro)/site-gratuit/page'

export const revalidate = 3600
export const metadata = freeWebsiteMetadata('en')

export default function Page() {
  return <FreeWebsiteView locale="en" />
}
