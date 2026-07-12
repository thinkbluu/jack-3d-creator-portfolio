import FadeIn from './FadeIn'
import ContactButton from './ContactButton'

export default function AboutSection() {
  return (
    <section id="about" className="section-shell relative overflow-hidden bg-[var(--bg)]">
      <div className="site-container relative z-10">
        <FadeIn>
          <header className="section-header">
            <p className="type-kicker mb-4">Despre studio</p>
            <h2 className="type-h2">Digital, dar profund uman</h2>
          </header>
        </FadeIn>

        <FadeIn delay={0.08}>
          <p className="max-w-3xl text-[clamp(1.3rem,2.4vw,1.9rem)] font-medium leading-[1.5] text-[var(--text)]">
            Suntem un studio care crede că un site bun nu se vede: se simte. Combinăm strategie, design și cod propriu pentru prezențe digitale care inspiră încredere și aduc clienți, nu doar vizite.
          </p>
        </FadeIn>

        <FadeIn delay={0.16} className="mt-10 flex justify-start">
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
