import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import TrackedLink from '@/components/TrackedLink'
import { localizePath } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/locale'
import { ui } from '@/lib/i18n/ui'
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

const contact = {
  ro: {
    title: 'Contact: WhatsApp, telefon și e-mail',
    description:
      'Contactează MAST Studio, studio de web design din Timișoara: WhatsApp și telefon +40 746 382 204, e-mail contact@maststudio.ro. Răspundem în aceeași zi.',
    name: 'Contact MAST Studio',
    kicker: 'Contact',
    intro:
      'Cel mai rapid ne găsești pe WhatsApp. Spune-ne în două fraze ce faci și ce vrei, iar în aceeași zi primești un răspuns cu preț și termen. Lucrăm cu afaceri din Timișoara și din toată România, fără să fie nevoie de o întâlnire față în față.',
    channels: 'Canale de contact',
    whatsappNote: 'Răspuns în aceeași zi, fără nicio obligație.',
    phone: 'Telefon',
    phoneNote: 'Sună-ne pentru o discuție scurtă despre proiect.',
    email: 'E-mail',
    emailNote: 'Pentru detalii, documente sau o cerere mai lungă.',
    whereTitle: 'Unde lucrăm',
    where:
      'Suntem din Timișoara și lucrăm la distanță, cu afaceri din tot orașul și din toată România. Nu avem un birou deschis publicului: discutăm pe WhatsApp, la telefon sau pe video, iar dacă ești în Timișoara ne putem vedea la tine.',
    socialLead: 'Ne găsești și pe',
    socialJoin: ' și ',
    idTitle: 'Date de identificare',
    company: 'Firmă',
    cui: 'CUI',
    register: 'Reg. Com.',
    formTitle: 'Preferi un formular?',
    formBody: 'Completează trei câmpuri și revenim noi cu pașii potriviți pentru site-ul, magazinul online sau aplicația ta.',
    formCta: 'Trimite o cerere de ofertă',
  },
  en: {
    title: 'Contact: WhatsApp, phone and email',
    description:
      'Contact MAST Studio, a web design studio in Timișoara: WhatsApp and phone +40 746 382 204, email contact@maststudio.ro. We reply the same day.',
    name: 'Contact MAST Studio',
    kicker: 'Contact',
    intro:
      'The fastest way to reach us is WhatsApp. Tell us in two sentences what you do and what you want, and the same day you get a reply with a price and a timeline. We work with businesses in Timișoara and across Romania, with no need for a face-to-face meeting.',
    channels: 'Contact channels',
    whatsappNote: 'A reply the same day, with no obligation.',
    phone: 'Phone',
    phoneNote: 'Call us for a short conversation about the project.',
    email: 'Email',
    emailNote: 'For details, documents, or a longer request.',
    whereTitle: 'Where we work',
    where:
      'We are based in Timișoara and we work remotely, with businesses across the city and across Romania. We don’t have an office open to the public: we talk on WhatsApp, by phone or on video, and if you’re in Timișoara we can meet you there.',
    socialLead: 'You can also find us on',
    socialJoin: ' and ',
    idTitle: 'Company details',
    company: 'Company',
    cui: 'CUI',
    register: 'Trade reg.',
    formTitle: 'Prefer a form?',
    formBody: 'Fill in three fields and we’ll come back with the right next steps for your website, online store or app.',
    formCta: 'Send a quote request',
  },
}

const channelClass =
  'porthole flex flex-col items-start gap-2 p-6 transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-[var(--brass)]'

export function contactMetadata(locale: Locale = 'ro') {
  const copy = contact[locale]
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: localizePath('/contact', locale),
    locale,
  })
}

export function ContactView({ locale }: { locale: Locale }) {
  const copy = contact[locale]
  const path = localizePath('/contact', locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.contact, path },
  ]

  return (
    <>
      <SiteHeader current="contact" />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <div className="site-container py-12 md:py-20">
          <Breadcrumbs items={crumbs} />
          <header className="mt-6 max-w-3xl">
            <p className="kicker">{copy.kicker}</p>
            <h1 className="type-h2 mt-4 text-balance">{copy.name}</h1>
            <p className="type-body mt-6 max-w-2xl">{copy.intro}</p>
          </header>

          <section aria-labelledby="canale" className="mt-12">
            <h2 id="canale" className="sr-only">
              {copy.channels}
            </h2>
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <li>
                <TrackedLink
                  href={whatsappUrl(ui[locale].whatsapp.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="whatsapp_click"
                  eventProperties={{ placement: 'contact_page' }}
                  className={channelClass}
                >
                  <span className="kicker">WhatsApp</span>
                  <span className="type-h3">{PHONE_DISPLAY}</span>
                  <span className="type-body text-[15px]">{copy.whatsappNote}</span>
                </TrackedLink>
              </li>
              <li>
                <TrackedLink href={PHONE_HREF} eventProperties={{ placement: 'contact_page' }} className={channelClass}>
                  <span className="kicker">{copy.phone}</span>
                  <span className="type-h3">{PHONE_DISPLAY}</span>
                  <span className="type-body text-[15px]">{copy.phoneNote}</span>
                </TrackedLink>
              </li>
              <li>
                <a href={EMAIL_HREF} className={channelClass}>
                  <span className="kicker">{copy.email}</span>
                  <span className="type-h3">{EMAIL}</span>
                  <span className="type-body text-[15px]">{copy.emailNote}</span>
                </a>
              </li>
            </ul>
          </section>

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2">
            <section>
              <h2 className="type-h3">{copy.whereTitle}</h2>
              <p className="type-body mt-4">{copy.where}</p>
              <p className="type-body mt-4">
                {copy.socialLead}{' '}
                {SOCIAL_LINKS.map((link, index) => (
                  <span key={link.url}>
                    {index > 0 ? copy.socialJoin : ''}
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                      {link.label}
                    </a>
                  </span>
                ))}
                .
              </p>
            </section>

            <section>
              <h2 className="type-h3">{copy.idTitle}</h2>
              <dl className="type-body mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                <dt className="font-semibold text-[var(--ink)]">{copy.company}</dt>
                <dd>{LEGAL_NAME}</dd>
                <dt className="font-semibold text-[var(--ink)]">{copy.cui}</dt>
                <dd>{VAT_ID}</dd>
                <dt className="font-semibold text-[var(--ink)]">{copy.register}</dt>
                <dd>{TRADE_REGISTER_NUMBER}</dd>
              </dl>
            </section>
          </div>

          <section className="porthole mt-16 flex max-w-3xl flex-col items-start gap-4 p-8">
            <h2 className="type-h3">{copy.formTitle}</h2>
            <p className="type-body">{copy.formBody}</p>
            <Link
              href={localizePath('/cerere-oferta', locale)}
              className="rounded-[var(--radius-pill)] bg-[var(--ink)] px-6 font-sans text-sm font-bold text-[var(--shell)] transition-colors hover:bg-[#2E2822]"
            >
              {copy.formCta}
            </Link>
          </section>
        </div>
      </main>
      <Footer />
      <JsonLd
        data={graph(
          webPageNode({ path, name: copy.name, description: copy.description, type: 'ContactPage', breadcrumb: true, mainEntity: businessRef, locale }),
          breadcrumbNode(crumbs),
        )}
      />
    </>
  )
}

export const metadata = contactMetadata('ro')

export default function ContactPage() {
  return <ContactView locale="ro" />
}
