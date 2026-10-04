import LocaleDocument from '@/components/LocaleDocument'
import NotFoundView, { notFoundMetadata } from '@/components/NotFoundView'
import '@/app/globals.css'

export const metadata = notFoundMetadata('ro')

/** Unmatched URLs that sit outside both root layouts. Romanian stays the default. */
export default function NotFound() {
  return (
    <LocaleDocument locale="ro">
      <NotFoundView locale="ro" />
    </LocaleDocument>
  )
}
