import NotFoundView, { notFoundMetadata } from '@/components/NotFoundView'

export const metadata = notFoundMetadata('en')

export default function NotFound() {
  return <NotFoundView locale="en" />
}
