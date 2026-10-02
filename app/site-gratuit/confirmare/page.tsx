import ContestPrivatePage, { InvalidLink, Notice, privateMetadata } from '@/components/ContestPrivatePage'
import { primaryButtonClass } from '@/components/form-styles'
import { isContestConfigured } from '@/lib/contest/config'
import { verifyToken } from '@/lib/contest/tokens'

export const dynamic = 'force-dynamic'
export const metadata = privateMetadata('Confirmă înscrierea')

type Props = { searchParams: Promise<{ t?: string; eroare?: string }> }

export default async function ConfirmPage({ searchParams }: Props) {
  const { t, eroare } = await searchParams
  const valid = isContestConfigured() && Boolean(verifyToken(t, 'confirm'))

  return (
    <ContestPrivatePage title="Confirmă înscrierea">
      {eroare === 'server' ? <Notice>Ceva nu a mers la confirmare. Încearcă din nou peste câteva minute.</Notice> : null}
      {valid && eroare !== 'link' ? (
        <form method="post" action="/api/site-gratuit/confirmare" className="flex flex-col items-start gap-5">
          <input type="hidden" name="t" value={t} />
          <p className="type-body">Apasă butonul ca să confirmi adresa de e-mail și înscrierea în runda din această lună.</p>
          <button type="submit" className={primaryButtonClass}>
            Confirm înscrierea
          </button>
        </form>
      ) : (
        <InvalidLink />
      )}
    </ContestPrivatePage>
  )
}
