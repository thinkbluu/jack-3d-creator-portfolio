import Link from 'next/link'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import ContactForm, { type ContactFormCopy } from '@/components/ContactForm'
import PageOpen from '@/components/studio/PageOpen'
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
import { PAGE_WORDS } from '@/lib/page-words'

const formCopy: Record<Locale, ContactFormCopy> = {
  ro: {
    name: 'Nume',
    email: 'E-mail',
    company: 'Firmă',
    optional: '(opțional)',
    topic: 'Despre ce e vorba',
    topics: { project: 'Un proiect nou', question: 'O întrebare', press: 'Presă sau colaborare', other: 'Altceva' },
    message: 'Mesaj',
    messageHint: 'Ce faci, ce ai nevoie și, dacă știi deja, până când.',
    submit: 'Trimite pe email',
    submitWhatsapp: 'Continuă pe WhatsApp',
    sending: 'Se trimite',
    channelLegend: 'Cum vrei să ne scrii?',
    channelWhatsapp: 'WhatsApp',
    channelEmail: 'Email',
    hintWhatsapp: 'Se deschide WhatsApp cu mesajul gata scris. Tu doar apeși Trimite.',
    hintEmail: 'Mesajul ajunge la contact@maststudio.ro și îți răspundem pe email.',
    waIntro: 'Salut! {topic}:',
    messageError: 'Scrie-ne măcar o frază (minimum 10 caractere).',
    errorSwitch: 'Trimite-l pe WhatsApp',
    doneTitle: 'Mulțumim. Am primit.',
    doneText: 'Îți răspundem pe e-mail în cel mult o zi lucrătoare, de obicei chiar azi. Ți-am trimis și o confirmare.',
    error: 'Mesajul nu a plecat. Scrie-ne direct la contact@maststudio.ro.',
    privacy: 'Folosim datele doar ca să-ți răspundem. Detalii în politica de confidențialitate.',
  },
  en: {
    name: 'Name',
    email: 'Email',
    company: 'Company',
    optional: '(optional)',
    topic: 'What it’s about',
    topics: { project: 'A new project', question: 'A question', press: 'Press or partnership', other: 'Something else' },
    message: 'Message',
    messageHint: 'What you do, what you need and, if you know already, by when.',
    submit: 'Send by email',
    submitWhatsapp: 'Continue on WhatsApp',
    sending: 'Sending',
    channelLegend: 'How would you like to write to us?',
    channelWhatsapp: 'WhatsApp',
    channelEmail: 'Email',
    hintWhatsapp: 'WhatsApp opens with the message already written. You just press Send.',
    hintEmail: 'The message goes to contact@maststudio.ro and we reply by email.',
    waIntro: 'Hi! {topic}:',
    messageError: 'Write at least a sentence (10 characters or more).',
    errorSwitch: 'Send it on WhatsApp',
    doneTitle: 'Thank you. It’s here.',
    doneText: 'We reply by email within one working day, usually today. We’ve sent you a confirmation too.',
    error: 'The message didn’t go through. Write to us at contact@maststudio.ro.',
    privacy: 'We use your details only to reply. More in the privacy policy.',
  },
}

const contact = {
  ro: {
    word: PAGE_WORDS['/contact'].ro,
    lead: 'Răspundem în aceeași zi.',
    formHead: 'Un mesaj.',
    formLead: 'Pentru detalii, documente sau o cerere mai lungă. Ajunge direct la contact@maststudio.ro.',
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
    word: PAGE_WORDS['/contact'].en,
    lead: 'We reply the same day.',
    formHead: 'A message.',
    formLead: 'For details, documents or a longer request. It goes straight to contact@maststudio.ro.',
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
  const copy = { ...contact[locale], form: formCopy[locale] }
  const path = localizePath('/contact', locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.contact, path },
  ]

  return (
    <>
      <SiteHeader current="contact" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageOpen crumbs={crumbs} index="06" title={copy.name} word={copy.word} lead={copy.lead} short>
          <p className="max-w-sm leading-relaxed text-[var(--fg-2)]">{copy.intro}</p>
        </PageOpen>

        <div className="studio-container page-section grid gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-24">
          <section aria-labelledby="formular">
            <h2 id="formular" className="section-title section-title-sm display-xl">
              {copy.formHead}
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--ink-2)]">{copy.formLead}</p>
            <div className="mt-12">
              <ContactForm copy={copy.form} locale={locale} />
            </div>
          </section>

          <aside className="flex flex-col gap-16">
            <section aria-labelledby="canale">
              <h2 id="canale" className="mono-label text-[var(--ink-3)]">
                {copy.channels}
              </h2>
              <ul className="big-rows mt-6">
                <li>
                  <TrackedLink
                    href={whatsappUrl(ui[locale].whatsapp.general)}
                    target="_blank"
                    rel="noopener noreferrer"
                    eventName="whatsapp_click"
                    eventProperties={{ placement: 'contact_page' }}
                    className="contact-line"
                  >
                    <span className="mono-label">WhatsApp</span>
                    <span className="contact-line-value">{PHONE_DISPLAY}</span>
                    <span className="contact-line-note">{copy.whatsappNote}</span>
                  </TrackedLink>
                </li>
                <li>
                  <TrackedLink href={PHONE_HREF} eventProperties={{ placement: 'contact_page' }} className="contact-line">
                    <span className="mono-label">{copy.phone}</span>
                    <span className="contact-line-value">{PHONE_DISPLAY}</span>
                    <span className="contact-line-note">{copy.phoneNote}</span>
                  </TrackedLink>
                </li>
                <li>
                  <a href={EMAIL_HREF} className="contact-line">
                    <span className="mono-label">{copy.email}</span>
                    <span className="contact-line-value">{EMAIL}</span>
                    <span className="contact-line-note">{copy.emailNote}</span>
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mono-label text-[var(--ink-3)]">{copy.whereTitle}</h2>
              <p className="mt-4 leading-relaxed text-[var(--ink-2)]">{copy.where}</p>
              <p className="mt-4 text-[var(--ink-2)]">
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
              <h2 className="mono-label text-[var(--ink-3)]">{copy.idTitle}</h2>
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[var(--ink-2)]">
                <dt className="font-semibold text-[var(--ink)]">{copy.company}</dt>
                <dd>{LEGAL_NAME}</dd>
                <dt className="font-semibold text-[var(--ink)]">{copy.cui}</dt>
                <dd>{VAT_ID}</dd>
                <dt className="font-semibold text-[var(--ink)]">{copy.register}</dt>
                <dd>{TRADE_REGISTER_NUMBER}</dd>
              </dl>
            </section>

            <Link href={localizePath('/cerere-oferta', locale)} className="big-row">
              <span className="mono-label text-[var(--fg-3)]">→</span>
              <span>
                <span className="big-row-name block text-[clamp(1.6rem,2.6vw,2.4rem)]">{copy.formCta}</span>
                <span className="mt-2 block text-[var(--ink-2)]">{copy.formBody}</span>
              </span>
              <span aria-hidden="true" className="big-row-arrow">→</span>
            </Link>
          </aside>
        </div>
      </main>
      <Footer cta={false} />
      <JsonLd
        data={graph(
          webPageNode({ path, name: copy.name, description: copy.description, type: 'ContactPage', breadcrumb: true, mainEntity: businessRef, locale }),
          breadcrumbNode(crumbs),
        )}
      />
    </>
  )
}
