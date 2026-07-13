import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-[var(--bg)] text-[var(--text)]">
      <div className="site-container flex max-w-4xl flex-col gap-7 py-24">
        <p className="type-kicker text-[var(--gold)]">BRG 404 · În afara hărții</p>
        <h1 className="type-h1 text-balance">Portul acesta nu există.</h1>
        <p className="type-body max-w-2xl !text-[var(--text-2)]">Coordonatele nu duc la o pagină activă. Întoarce-te la bord și continuă ruta.</p>
        <Link href="/" className="w-fit rounded-full border border-[var(--gold)] px-6 py-3 font-medium text-[var(--gold)] transition-colors hover:bg-[var(--gold)] hover:text-[var(--bg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]">Înapoi la MAST Studio</Link>
      </div>
    </main>
  )
}
