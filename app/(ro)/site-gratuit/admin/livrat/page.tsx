import ContestPrivatePage, { InvalidLink, Notice, privateMetadata } from '@/components/ContestPrivatePage'
import { inputClass, labelClass, primaryButtonClass, textLinkClass } from '@/components/form-styles'
import { isContestConfigured, roundLabel } from '@/lib/contest/config'
import { getDelivery } from '@/lib/contest/service'
import { verifyToken } from '@/lib/contest/tokens'
import type { Locale } from '@/lib/i18n/locale'

export const dynamic = 'force-dynamic'

type DeliveryState = 'livrat' | 'link-invalid' | 'neconfirmat' | 'eroare'

const messages: Record<Locale, Record<DeliveryState, { text: string; success?: boolean }>> = {
  ro: {
    livrat: { text: 'Am salvat site-ul livrat. Dacă afacerea a acceptat publicarea, apare la câștigători pe pagina concursului în cel mult o oră.', success: true },
    'link-invalid': { text: 'Adresa site-ului nu este validă.' },
    neconfirmat: { text: 'Câștigătorul nu a confirmat încă premiul.' },
    eroare: { text: 'Ceva nu a mers. Încearcă din nou peste câteva minute.' },
  },
  en: {
    livrat: { text: 'The delivered website is saved. If the business agreed to publication, it appears with the winners on the contest page within an hour.', success: true },
    'link-invalid': { text: 'The website address is not valid.' },
    neconfirmat: { text: 'The winner has not confirmed the prize yet.' },
    eroare: { text: 'Something went wrong. Try again in a few minutes.' },
  },
}

const deliveredRo = {
    metaTitle: 'Site livrat',
    invalidTitle: 'Site livrat',
    title: (business: string) => `Site livrat: ${business}`,
    winner: (roundName: string) => `Câștigătorul rundei din ${roundName}.`,
    deliveredLead: 'Site livrat:',
    urlLabel: 'Adresa site-ului livrat',
    placeholder: 'https://numeafacere.ro',
    submit: 'Marchează ca livrat',
}

const deliveredEn: typeof deliveredRo = {
    metaTitle: 'Website delivered',
    invalidTitle: 'Website delivered',
    title: (business: string) => `Website delivered: ${business}`,
    winner: (roundName: string) => `Winner of the ${roundName} round.`,
    deliveredLead: 'Delivered website:',
    urlLabel: 'Address of the delivered website',
    placeholder: 'https://businessname.ro',
    submit: 'Mark as delivered',
}

const copy = { ro: deliveredRo, en: deliveredEn }

type Props = { locale: Locale; searchParams: Promise<{ t?: string; stare?: string }> }

export function adminDeliveredMetadata(locale: Locale) {
  return privateMetadata(copy[locale].metaTitle)
}

export async function AdminDeliveredView({ locale, searchParams }: Props) {
  const t = copy[locale]
  const { t: token, stare } = await searchParams
  const round = isContestConfigured() ? verifyToken(token, 'admin-delivered') : null
  const delivery = round ? await getDelivery(round) : null
  const message = stare && Object.hasOwn(messages[locale], stare) ? messages[locale][stare as DeliveryState] : undefined

  if (!round || !delivery) {
    return (
      <ContestPrivatePage locale={locale} title={t.invalidTitle}>
        <InvalidLink locale={locale} />
      </ContestPrivatePage>
    )
  }

  return (
    <ContestPrivatePage locale={locale} title={t.title(delivery.businessName)}>
      {message ? <Notice tone={message.success ? 'success' : 'info'}>{message.text}</Notice> : null}
      <p className="type-body">{t.winner(roundLabel(round, locale))}</p>
      {delivery.deliveredUrl ? (
        <p className="type-body">
          {t.deliveredLead}{' '}
          <a href={delivery.deliveredUrl} target="_blank" rel="noopener noreferrer" className={`${textLinkClass} break-all`}>
            {delivery.deliveredUrl}
          </a>
        </p>
      ) : null}
      <form method="post" action="/api/site-gratuit/admin/livrat" className="flex flex-col items-start gap-4">
        <input type="hidden" name="t" value={token} />
        <input type="hidden" name="locale" value={locale} />
        <div className="w-full">
          <label htmlFor="delivered-url" className={labelClass}>
            {t.urlLabel}
          </label>
          <input id="delivered-url" name="url" type="url" required defaultValue={delivery.deliveredUrl ?? ''} placeholder={t.placeholder} className={inputClass} />
        </div>
        <button type="submit" className={primaryButtonClass}>
          {t.submit}
        </button>
      </form>
    </ContestPrivatePage>
  )
}

export const metadata = adminDeliveredMetadata('ro')

export default function AdminDeliveredPage({ searchParams }: { searchParams: Promise<{ t?: string; stare?: string }> }) {
  return <AdminDeliveredView locale="ro" searchParams={searchParams} />
}
