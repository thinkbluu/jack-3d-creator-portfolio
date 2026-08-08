import FadeIn from './FadeIn'
import ContactButton from './ContactButton'
import ChartKicker from './ChartKicker'

export default function AboutSection() {
  return (
    <section id="about" className="scene-section">
      {/* Narrow and left-anchored, so it reads as an aside rather than a full-width slab. */}
      <div className="porthole scene-panel" style={{ maxWidth: '720px', marginLeft: 0, marginRight: 'auto' }}>
        <FadeIn>
          <ChartKicker label="Despre" />
          <h2 className="type-h2 text-balance">Digital, dar profund uman.</h2>
        </FadeIn>

        <FadeIn delay={0.08}>
          <p className="type-body mt-6 max-w-[64ch] text-[clamp(1.05rem,1.6vw,1.3rem)] leading-relaxed">
            Suntem un studio mic din Timișoara care crede că un site bun se simte, nu doar se vede. Nu folosim șabloane
            și nu vorbim în termeni tehnici: ascultăm cum funcționează afacerea ta și construim site-ul care o vinde.
            Simplu de înțeles, ușor de folosit, al tău cu totul.
          </p>
        </FadeIn>

        <FadeIn delay={0.16} className="mt-9 flex justify-start">
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
