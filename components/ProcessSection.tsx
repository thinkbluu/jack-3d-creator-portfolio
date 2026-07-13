import FadeIn from './FadeIn'
import ChartKicker from './ChartKicker'

const steps = [
  { number: '01', title: 'Ne scrii pe WhatsApp', description: 'Ne spui în două fraze ce faci și ce îți trebuie. În aceeași zi primești întrebările noastre și oferta.' },
  { number: '02', title: 'Trimiți conținutul', description: 'Texte de bază, poze și logo, ghidate de checklist-ul nostru. Din acest moment pornește cronometrul.' },
  { number: '03', title: 'Site-ul e live', description: '48 de ore pentru site-uri de prezentare, 7 zile pentru magazine. Plătești 50% la start și 50% la final.' },
]

export default function ProcessSection() {
  return (
    <section id="process" className="section-shell bg-[var(--bg)]">
      <div className="site-container">
        <FadeIn>
          <header className="section-header">
            <ChartKicker bearing="06" label="Proces" />
            <h2 className="type-h2">Cum lucrăm</h2>
            <p className="type-body mt-5">Trei pași transparenți, de la primul mesaj până la lansare.</p>
          </header>
        </FadeIn>
        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <FadeIn key={step.number} delay={index * 0.08}>
              <article>
                <span className="text-transparent" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, WebkitTextStroke: '1px rgba(245,241,232,0.18)' }}>{step.number}</span>
                <h3 className="type-h3 mt-3 text-[var(--text)]">{step.title}</h3>
                <p className="type-body mt-3">{step.description}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
