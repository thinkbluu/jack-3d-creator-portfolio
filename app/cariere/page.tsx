import Breadcrumbs from '@/components/Breadcrumbs'
import CareerForm from '@/components/CareerForm'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import { CV_RETENTION_MONTHS } from '@/lib/careers'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { EMAIL, EMAIL_HREF } from '@/lib/site'

const path = '/cariere'
const title = 'Cariere la MAST Studio: trimite-ne CV-ul'
const description =
  'Cariere la MAST Studio, studio de web design din Timișoara. Nu avem posturi deschise acum, dar poți trimite CV-ul pentru web design, programare sau texte.'

export const metadata = pageMetadata({ title, description, path, absoluteTitle: true })

const crumbs: BreadcrumbItem[] = [
  { name: 'Acasă', path: '/' },
  { name: 'Cariere', path },
]

const roles = [
  { title: 'Web design', text: 'Interfețe clare pentru afaceri mici, gândite întâi pentru telefon.' },
  { title: 'Programare front-end', text: 'Site-uri rapide și accesibile, construite cu React și Next.js.' },
  { title: 'Texte și conținut', text: 'Texte pentru site-uri și ghiduri în limba română, simple și precise.' },
  { title: 'Marketing și vânzări', text: 'Discuții cu clienții, oferte și campanii pentru afaceri mici.' },
]

export default function CareersPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <div className="site-container py-12 md:py-20">
          <Breadcrumbs items={crumbs} />

          <header className="mt-6 max-w-3xl">
            <p className="kicker">Cariere</p>
            <h1 className="type-h2 mt-4 text-balance">Cariere la MAST Studio</h1>
            <p className="type-body mt-6 max-w-2xl">
              Momentan nu avem posturi deschise. Creștem însă treptat și vrem să cunoaștem din timp oameni buni. Dacă vrei să lucrezi cu noi, trimite-ne CV-ul, iar când apare un rol potrivit, te contactăm noi.
            </p>
          </header>

          <section aria-labelledby="pe-cine-cautam" className="mt-14 max-w-3xl">
            <h2 id="pe-cine-cautam" className="type-h3">
              Pe cine căutăm, de obicei
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {roles.map((role) => (
                <li key={role.title} className="porthole p-6">
                  <h3 className="font-sans text-[15px] font-semibold text-[var(--ink)]">{role.title}</h3>
                  <p className="type-body mt-2 text-[15px]">{role.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="cum-lucram" className="mt-14 max-w-3xl border-t border-[var(--hairline)] pt-12">
            <h2 id="cum-lucram" className="type-h3">
              Cum lucrăm
            </h2>
            <p className="type-body mt-4">
              Suntem o echipă mică din Timișoara și lucrăm la distanță, cu afaceri mici din toată România. Avem un proces fix, de la prima discuție la lansare, și construim site-uri de prezentare, magazine online și aplicații. Lucrăm în limba română, cu clienți care vor rezultate clare, nu jargon.
            </p>
          </section>

          <section aria-labelledby="ce-se-intampla" className="mt-14 max-w-3xl border-t border-[var(--hairline)] pt-12">
            <h2 id="ce-se-intampla" className="type-h3">
              Ce se întâmplă cu CV-ul tău
            </h2>
            <ul className="type-body mt-4 flex list-disc flex-col gap-2 pl-6">
              <li>Primești pe e-mail confirmarea că l-am primit.</li>
              <li>Îl păstrăm cel mult {CV_RETENTION_MONTHS} luni și îl folosim doar pentru recrutare.</li>
              <li>Te contactăm doar când apare un rol potrivit pentru tine.</li>
              <li>
                Poți cere oricând ștergerea, scriindu-ne la{' '}
                <a href={EMAIL_HREF} className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                  {EMAIL}
                </a>
                .
              </li>
            </ul>
          </section>

          <section aria-labelledby="trimite-cv" className="mt-14 max-w-3xl">
            <h2 id="trimite-cv" className="type-h3">
              Trimite-ne CV-ul
            </h2>
            <div className="mt-6">
              <CareerForm />
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <JsonLd data={graph(webPageNode({ path, name: 'Cariere la MAST Studio', description, breadcrumb: true }), breadcrumbNode(crumbs))} />
    </>
  )
}
