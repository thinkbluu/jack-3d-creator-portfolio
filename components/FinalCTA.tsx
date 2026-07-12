import ContactButton from './ContactButton'
import FadeIn from './FadeIn'

export default function FinalCTA() {
  return (
    <section id="contact" className="section-shell border-t border-[var(--line)] bg-[var(--bg)]">
      <div className="site-container">
        <FadeIn>
          <header className="section-header">
            <p className="type-kicker mb-4">Următorul pas</p>
            <h2 className="type-h2">Construim ceva care contează?</h2>
            <p className="type-body mt-5">Lucrăm cu maximum 4 proiecte noi pe lună. Rezervă-ți locul.</p>
          </header>
          <div className="flex justify-start"><ContactButton /></div>
        </FadeIn>
        <footer className="mt-20 grid gap-3 border-t border-[var(--line)] pt-6 text-xs text-[var(--text-3)] md:grid-cols-2">
          <p>MAST Studio · Web design & development</p>
          <p className="md:text-right">Available in Romanian and English · © 2026</p>
        </footer>
      </div>
    </section>
  )
}
