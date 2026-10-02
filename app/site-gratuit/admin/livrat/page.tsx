import ContestPrivatePage, { InvalidLink, Notice, privateMetadata } from '@/components/ContestPrivatePage'
import { inputClass, labelClass, primaryButtonClass, textLinkClass } from '@/components/form-styles'
import { isContestConfigured, roundLabel } from '@/lib/contest/config'
import { getDelivery } from '@/lib/contest/service'
import { verifyToken } from '@/lib/contest/tokens'

export const dynamic = 'force-dynamic'
export const metadata = privateMetadata('Site livrat')

const messages: Record<string, { text: string; success?: boolean }> = {
  livrat: { text: 'Am salvat site-ul livrat. Dacă afacerea a acceptat publicarea, apare la câștigători pe pagina concursului în cel mult o oră.', success: true },
  'link-invalid': { text: 'Adresa site-ului nu este validă.' },
  neconfirmat: { text: 'Câștigătorul nu a confirmat încă premiul.' },
  eroare: { text: 'Ceva nu a mers. Încearcă din nou peste câteva minute.' },
}

type Props = { searchParams: Promise<{ t?: string; stare?: string }> }

export default async function AdminDeliveredPage({ searchParams }: Props) {
  const { t, stare } = await searchParams
  const round = isContestConfigured() ? verifyToken(t, 'admin-delivered') : null
  const delivery = round ? await getDelivery(round) : null
  const message = stare && Object.hasOwn(messages, stare) ? messages[stare] : undefined

  if (!round || !delivery) {
    return (
      <ContestPrivatePage title="Site livrat">
        <InvalidLink />
      </ContestPrivatePage>
    )
  }

  return (
    <ContestPrivatePage title={`Site livrat: ${delivery.businessName}`}>
      {message ? <Notice tone={message.success ? 'success' : 'info'}>{message.text}</Notice> : null}
      <p className="type-body">Câștigătorul rundei din {roundLabel(round)}.</p>
      {delivery.deliveredUrl ? (
        <p className="type-body">
          Site livrat:{' '}
          <a href={delivery.deliveredUrl} target="_blank" rel="noopener noreferrer" className={`${textLinkClass} break-all`}>
            {delivery.deliveredUrl}
          </a>
        </p>
      ) : null}
      <form method="post" action="/api/site-gratuit/admin/livrat" className="flex flex-col items-start gap-4">
        <input type="hidden" name="t" value={t} />
        <div className="w-full">
          <label htmlFor="delivered-url" className={labelClass}>
            Adresa site-ului livrat
          </label>
          <input id="delivered-url" name="url" type="url" required defaultValue={delivery.deliveredUrl ?? ''} placeholder="https://numeafacere.ro" className={inputClass} />
        </div>
        <button type="submit" className={primaryButtonClass}>
          Marchează ca livrat
        </button>
      </form>
    </ContestPrivatePage>
  )
}
