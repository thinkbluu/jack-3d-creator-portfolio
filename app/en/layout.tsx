import LocaleDocument, { localeMetadata, localeViewport } from '@/components/LocaleDocument'
import '@/app/globals.css'

export const metadata = localeMetadata('en')
export const viewport = localeViewport

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LocaleDocument locale="en">{children}</LocaleDocument>
}
