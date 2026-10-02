import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import TrackedLink from '@/components/TrackedLink'
import { breadcrumbNode, businessRef, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import {
  EMAIL,
  EMAIL_HREF,
  LEGAL_NAME,
  PHONE_DISPLAY,
  PHONE_HREF,
  SOCIAL_LINKS,
  TRADE_REGISTER_NUMBER,
  VAT_ID,
  whatsappUrl,
} from '@/lib/site'

const path = '/contact'
const description =
  'Contactează MAST Studio, studio de web design din Timișoara: WhatsApp și telefon +40 746 382 204, e-mail contact@maststudio.ro. Răspundem în aceeași zi.'

export const metadata = pageMetadata({
  title: 'Contact: WhatsApp, telefon și e-mail',
  description,
  path,
})

const crumbs: BreadcrumbItem[] = [
  { name: 'Acasă', path: '/' },
  { name: 'Contact', path },
]

const channelClass =
  'porthole flex flex-col items-start gap-2 p-6 transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-[var(--brass)]'

export default function ContactPage() {
  return (
    <>
      <SiteHeader current="contact" />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <div className="site-container py-12 md:py-20">
          <Breadcrumbs items={crumbs} />
          <header className="mt-6 max-w-3xl">
            <p className="kicker">Contact</p>
            <h1 className="type-h2 mt-4 text-balance">Contact MAST Studio</h1>
            <p className="type-body mt-6 max-w-2xl">
              Cel mai rapid ne găsești pe WhatsApp. Spune-ne în două fraze ce faci și ce vrei, iar în aceeași zi primești un răspuns cu preț și termen. Lucrăm cu afaceri din Timișoara și din toată România, fără să fie nevoie de o întâlnire față în față.
            </p>
          </header>

          <section aria-labelledby="canale" className="mt-12">
            <h2 id="canale" className="sr-only">
              Canale de contact
            </h2>
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <li>
                <TrackedLink
                  href={whatsappUrl('Salut! Vreau să discutăm despre un site pentru afacerea mea.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="whatsapp_click"
                  eventProperties={{ placement: 'contact_page' }}
                  className={channelClass}
                >
                  <span className="kicker">WhatsApp</span>
                  <span className="type-h3">{PHONE_DISPLAY}</span>
                  <span className="type-body text-[15px]">Răspuns în aceeași zi, fără nicio obligație.</span>
                </TrackedLink>
              </li>
              <li>
                <TrackedLink href={PHONE_HREF} eventProperties={{ placement: 'contact_page' }} className={channelClass}>
                  <span className="kicker">Telefon</span>
                  <span className="type-h3">{PHONE_DISPLAY}</span>
                  <span className="type-body text-[15px]">Sună-ne pentru o discuție scurtă despre proiect.</span>
                </TrackedLink>
              </li>
              <li>
                <a href={EMAIL_HREF} className={channelClass}>
                  <span className="kicker">E-mail</span>
                  <span className="type-h3">{EMAIL}</span>
                  <span className="type-body text-[15px]">Pentru detalii, documente sau o cerere mai lungă.</span>
                </a>
              </li>
            </ul>
          </section>

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2">
            <section>
              <h2 className="type-h3">Unde lucrăm</h2>
              <p className="type-body mt-4">
                Suntem din Timișoara și lucrăm la distanță, cu afaceri din tot orașul și din toată România. Nu avem un birou deschis publicului: discutăm pe WhatsApp, la telefon sau pe video, iar dacă ești în Timișoara ne putem vedea la tine.
              </p>
              <p className="type-body mt-4">
                Ne găsești și pe{' '}
                {SOCIAL_LINKS.map((link, index) => (
                  <span key={link.url}>
                    {index > 0 ? ' și ' : ''}
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                      {link.label}
                    </a>
                  </span>
                ))}
                .
              </p>
            </section>

            <section>
              <h2 className="type-h3">Date de identificare</h2>
              <dl className="type-body mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                <dt className="font-semibold text-[var(--ink)]">Firmă</dt>
                <dd>{LEGAL_NAME}</dd>
                <dt className="font-semibold text-[var(--ink)]">CUI</dt>
                <dd>{VAT_ID}</dd>
                <dt className="font-semibold text-[var(--ink)]">Reg. Com.</dt>
                <dd>{TRADE_REGISTER_NUMBER}</dd>
              </dl>
            </section>
          </div>

          <section className="porthole mt-16 flex max-w-3xl flex-col items-start gap-4 p-8">
            <h2 className="type-h3">Preferi un formular?</h2>
            <p className="type-body">
              Completează trei câmpuri și revenim noi cu pașii potriviți pentru site-ul, magazinul online sau aplicația ta.
            </p>
            <Link
              href="/cerere-oferta"
              className="rounded-[var(--radius-pill)] bg-[var(--ink)] px-6 font-sans text-sm font-bold text-[var(--shell)] transition-colors hover:bg-[#2E2822]"
            >
              Trimite o cerere de ofertă
            </Link>
          </section>
        </div>
      </main>
      <Footer />
      <JsonLd
        data={graph(
          webPageNode({ path, name: 'Contact MAST Studio', description, type: 'ContactPage', breadcrumb: true, mainEntity: businessRef }),
          breadcrumbNode(crumbs),
        )}
      />
    </>
  )
}
