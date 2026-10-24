import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import PageOpen from '@/components/studio/PageOpen'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, businessRef, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { getTeam, getTeamMember } from '@/lib/team'

const chrome = {
  ro: { team: 'Echipa', focus: 'Se ocupă de', others: 'Restul echipei', back: 'Înapoi la studio' },
  en: { team: 'Team', focus: 'Looks after', others: 'The rest of the team', back: 'Back to the studio' },
} as const

export function teamMemberMetadata(locale: Locale, slug: string): Metadata {
  const member = getTeamMember(slug)
  if (!member) return {}
  return pageMetadata({
    title: `${member.name}, ${member.role[locale]} · MAST Studio`,
    description: member.bio[locale][0]?.slice(0, 155) ?? member.role[locale],
    path: localizePath(`/echipa/${member.slug}`, locale),
    locale,
  })
}

/** A person's page: big name, role, portrait, a few paragraphs, and the others. */
export function TeamMemberView({ locale, slug }: { locale: Locale; slug: string }) {
  const member = getTeamMember(slug)
  if (!member) notFound()
  const copy = chrome[locale]
  const path = localizePath(`/echipa/${member.slug}`, locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.about, path: localizePath('/despre', locale) },
    { name: member.name, path },
  ]
  const others = getTeam().filter((person) => person.slug !== member.slug)
  const sameAs = [member.linkedin, ...(member.links?.map((link) => link.url) ?? [])].filter(Boolean)

  return (
    <>
      <SiteHeader current="despre" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageOpen crumbs={crumbs} title={`${member.name} · ${member.role[locale]}`} word={`${member.name.split(' ')[0]}.`} lead={member.role[locale]} short />
        <section className="page-section">
          <div className="studio-container grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div className="team-card-photo">
              {member.photo ? <Image src={member.photo} alt={member.name} fill priority sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" /> : null}
            </div>
            <div>
              <div className="flex flex-col gap-5 text-xl leading-relaxed text-[var(--ink-2)]">
                {member.bio[locale].map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {member.focus?.[locale]?.length ? (
                <>
                  <p className="mono-label mt-12 text-[var(--ink-3)]">{copy.focus}</p>
                  <ul className="big-rows mt-4">
                    {member.focus[locale].map((item) => (
                      <li key={item} className="border-b border-[var(--line)] py-4 text-lg">
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {member.links?.length ? (
                <ul className="mt-10 flex flex-wrap gap-6">
                  {member.links.map((link) => (
                    <li key={link.url}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="mono-label underline underline-offset-4">
                        {link.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </section>
        <section className="tone-warm page-section">
          <div className="studio-container">
            {others.length ? (
              <>
                <p className="mono-label text-[var(--fg-3)]">{copy.others}</p>
                <ul className="team-grid">
                  {others.map((person) => (
                    <li key={person.slug}>
                      <Link href={localizePath(`/echipa/${person.slug}`, locale)} className="team-card link-block">
                        <span className="team-card-photo">
                          {person.photo ? <Image src={person.photo} alt="" fill sizes="25vw" className="object-cover" /> : null}
                        </span>
                        <span className="team-card-name display-xl">{person.name}</span>
                        <span className="mono-label text-[var(--ink-3)]">{person.role[locale]}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <Link href={localizePath('/despre', locale)} className="big-row mt-12">
              <span className="mono-label text-[var(--fg-3)]">←</span>
              <span className="big-row-name">{copy.back}</span>
              <span aria-hidden="true" className="big-row-arrow">→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd
        data={graph(
          webPageNode({ path, name: member.name, description: member.role[locale], type: 'ProfilePage', breadcrumb: true, locale }),
          breadcrumbNode(crumbs),
          {
            '@type': 'Person',
            '@id': `${absoluteUrl(path)}#person`,
            name: member.name,
            url: absoluteUrl(path),
            jobTitle: member.role[locale],
            worksFor: businessRef,
            ...(member.photo ? { image: absoluteUrl(member.photo) } : {}),
            ...(sameAs.length ? { sameAs } : {}),
          },
        )}
      />
    </>
  )
}
