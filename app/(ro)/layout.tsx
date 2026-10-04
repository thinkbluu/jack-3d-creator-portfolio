import LocaleDocument, { localeMetadata, localeViewport } from '@/components/LocaleDocument'
import '@/app/globals.css'

export const metadata = localeMetadata('ro')
export const viewport = localeViewport

export default function RomanianLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LocaleDocument locale="ro">{children}</LocaleDocument>
}
