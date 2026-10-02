import Link from 'next/link'
import BlogCard from '@/components/BlogCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import TrackedLink from '@/components/TrackedLink'
import { getAllPosts } from '@/lib/blog'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl, whatsappUrl } from '@/lib/site'

const path = '/blog'
const title = 'Ghid: site-uri, prețuri și web design'
const description =
  'Ghiduri practice despre site-uri pentru afaceri mici: cât costă un site, cât durează, ce include prețul, magazin online sau site de prezentare. Fără jargon.'

export const metadata = pageMetadata({ title, description, path })

const crumbs: BreadcrumbItem[] = [
  { name: 'Acasă', path: '/' },
  { name: 'Ghid', path },
]

export default function BlogPage() {
  const posts = getAllPosts()

  const jsonLd = graph(
    webPageNode({ path, name: 'Ghid despre site-uri, prețuri și web design', description, type: 'CollectionPage', breadcrumb: true }),
    breadcrumbNode(crumbs),
    {
      '@type': 'ItemList',
      '@id': `${absoluteUrl(path)}#articole`,
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(`/blog/${post.slug}`),
        name: post.title,
      })),
    },
  )

  return (
    <>
      <SiteHeader current="blog" />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <div className="site-container py-12 md:py-20">
          <Breadcrumbs items={crumbs} />
          <div className="mt-6 max-w-3xl">
            <p className="kicker">Ghid</p>
            <h1 className="type-h2 mt-4 text-balance">Ghid despre site-uri, prețuri și web design</h1>
            <p className="type-body mt-6 max-w-2xl text-[var(--ink-2)]">
              Articole practice despre ce merită știut înainte, în timpul și după ce îți faci un site: prețuri reale, termene, ce include oferta și cum alegi furnizorul. Fără termeni tehnici. Pentru prețurile noastre, vezi{' '}
              <Link href="/servicii" className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                serviciile MAST Studio
              </Link>
              .
            </p>
          </div>

          <section aria-label="Articole" className="mt-14">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
              </div>
            ) : (
              <p className="border-t border-[var(--hairline)] pt-6 font-sans text-sm text-[var(--ink-2)]">
                Primele articole apar în curând.
              </p>
            )}
          </section>

          <section className="mt-20 border-t border-[var(--hairline)] pt-8">
            <p className="type-body text-[var(--ink-2)]">Ai o întrebare la care nu am răspuns încă?</p>
            <TrackedLink
              href={whatsappUrl('Salut! Am o întrebare despre un site: ')}
              target="_blank"
              rel="noopener noreferrer"
              eventProperties={{ placement: 'blog_index' }}
              className="mt-3 font-semibold text-[var(--brass-ink)] underline-offset-4 hover:underline"
            >
              Întreabă-ne pe WhatsApp →
            </TrackedLink>
          </section>
        </div>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}
