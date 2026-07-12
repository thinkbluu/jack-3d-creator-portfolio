export default function Footer() {
  const linkClass = 'transition-colors hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]'

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg)] text-sm text-[var(--text-3)]">
      <div className="site-container flex flex-col gap-6 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>MAST Studio</p>
          <nav aria-label="Linkuri juridice" className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="#" className={linkClass}>Confidențialitate</a>
            <a href="#" className={linkClass}>Cookies</a>
            <a href="#" className={linkClass}>Termeni</a>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 MAST Studio · MAST Consult S.R.L. · Timișoara</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="mailto:contact@maststudio.ro" className={linkClass}>contact@maststudio.ro</a>
            <a href="https://anpc.ro/ce-este-sal" target="_blank" rel="noopener" className={linkClass}>ANPC SAL</a>
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" className={linkClass}>SOL</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
