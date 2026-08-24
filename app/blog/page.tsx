import type { Metadata } from 'next'
import Link from 'next/link'
import BlogCard from '@/components/BlogCard'
import Footer from '@/components/Footer'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Ghid | MAST Studio',
  description: 'Articole practice despre ce merită știut înainte, în timpul și după ce îți faci un site.',
  alternates: { canonical: 'https://maststudio.ro/blog' },
}

const whatsappUrl = `https://wa.me/40746382204?text=${encodeURIComponent('Salut! Am o întrebare despre un site: ')}`

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <header className="border-b border-[var(--hairline)]">
        <nav aria-label="Navigație principală" className="site-container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span aria-hidden="true" className="size-[22px] bg-[var(--brass)]" style={{ mask: "url('/icons/mast-mark.svg') center / contain no-repeat", WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat" }} />
            <span className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-semibold">MAST</span>
              <span className="font-sans text-[10px] font-medium tracking-[.28em]">STUDIO</span>
            </span>
          </Link>
          <Link href="/" className="font-sans text-xs uppercase tracking-[0.16em] text-[var(--ink-2)] hover:text-[var(--ink)]">
            Înapoi la site
          </Link>
        </nav>
      </header>

      <div className="site-container py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="kicker">Ghid</p>
          <h1 className="type-h2 mt-4 text-balance">Ghid de orientare</h1>
          <p className="type-body mt-6 max-w-2xl text-[var(--ink-2)]">
            Articole practice despre ce merită știut înainte, în timpul și după ce îți faci un site. Fără termeni tehnici.
          </p>
        </div>

        <section aria-label="Articole" className="mt-14">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <p className="border-t border-[var(--hairline)] pt-6 font-sans text-sm text-[var(--ink-3)]">
              Primele articole apar în curând.
            </p>
          )}
        </section>

        <section className="mt-20 border-t border-[var(--hairline)] pt-8">
          <p className="type-body text-[var(--ink-2)]">Ai o întrebare la care nu am răspuns încă?</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[var(--brass)] underline-offset-4 hover:underline">
            Întreabă-ne →
          </a>
        </section>
      </div>
      <Footer />
    </main>
  )
}
