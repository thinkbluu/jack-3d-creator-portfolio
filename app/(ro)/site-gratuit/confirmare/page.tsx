import ContestPrivatePage, { InvalidLink, Notice, privateMetadata } from '@/components/ContestPrivatePage'
import { primaryButtonClass } from '@/components/form-styles'
import { isContestConfigured } from '@/lib/contest/config'
import { verifyToken } from '@/lib/contest/tokens'
import type { Locale } from '@/lib/i18n/locale'

export const dynamic = 'force-dynamic'

const copy = {
  ro: {
    title: 'Confirmă înscrierea',
    serverError: 'Ceva nu a mers la confirmare. Încearcă din nou peste câteva minute.',
    body: 'Apasă butonul ca să confirmi adresa de e-mail și înscrierea în runda din această lună.',
    submit: 'Confirm înscrierea',
  },
  en: {
    title: 'Confirm your entry',
    serverError: 'Something went wrong with the confirmation. Try again in a few minutes.',
    body: 'Press the button to confirm your email address and your entry in this month’s round.',
    submit: 'Confirm my entry',
  },
} satisfies Record<Locale, { title: string; serverError: string; body: string; submit: string }>

type Props = { locale: Locale; searchParams: Promise<{ t?: string; eroare?: string }> }

export function confirmMetadata(locale: Locale) {
  return privateMetadata(copy[locale].title)
}

export async function ConfirmView({ locale, searchParams }: Props) {
  const t = copy[locale]
  const { t: token, eroare } = await searchParams
  const valid = isContestConfigured() && Boolean(verifyToken(token, 'confirm'))

  return (
    <ContestPrivatePage locale={locale} title={t.title}>
      {eroare === 'server' ? <Notice>{t.serverError}</Notice> : null}
      {valid && eroare !== 'link' ? (
        <form method="post" action="/api/site-gratuit/confirmare" className="flex flex-col items-start gap-5">
          <input type="hidden" name="t" value={token} />
          <input type="hidden" name="locale" value={locale} />
          <p className="type-body">{t.body}</p>
          <button type="submit" className={primaryButtonClass}>
            {t.submit}
          </button>
        </form>
      ) : (
        <InvalidLink locale={locale} />
      )}
    </ContestPrivatePage>
  )
}

export const metadata = confirmMetadata('ro')

export default function ConfirmPage({ searchParams }: { searchParams: Promise<{ t?: string; eroare?: string }> }) {
  return <ConfirmView locale="ro" searchParams={searchParams} />
}
