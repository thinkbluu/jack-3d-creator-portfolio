import NotFoundView, { notFoundMetadata } from '@/components/NotFoundView'

export const metadata = notFoundMetadata('ro')

export default function NotFound() {
  return <NotFoundView locale="ro" />
}
