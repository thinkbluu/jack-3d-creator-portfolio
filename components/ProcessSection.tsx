import FadeIn from './FadeIn'
import ChartKicker from './ChartKicker'

const steps = [
  {
    number: '01',
    title: 'Ne scrii',
    description: 'În două fraze ne spui ce faci. În aceeași zi primești oferta și lista scurtă cu ce ne trebuie de la tine.',
  },
  {
    number: '02',
    title: 'Trimiți materialele',
    description: 'Texte de bază, poze, siglă. Atât. Din momentul în care le avem, pornește cronometrul.',
  },
  {
    number: '03',
    title: 'Vezi și decizi',
    description: 'Îți trimitem site-ul live. Îl deschizi, îl arăți cui vrei, și abia apoi plătești restul.',
  },
]

export default function ProcessSection() {
  return (
    <>
    <section id="process" className="scene-section">
      <div className="porthole scene-panel" style={{ maxWidth: '860px' }}>
        <FadeIn>
          <ChartKicker label="Cum lucrăm" />
          <h2 className="type-h2 text-balance">Trei pași. Fără bătăi de cap.</h2>
        </FadeIn>
        <div className="mt-9 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <FadeIn key={step.number} delay={index * 0.08}>
              <article>
                <span
                  aria-hidden="true"
                  className="block font-display leading-none"
                  style={{ fontSize: '44px', fontWeight: 600, color: 'rgba(26,23,20,0.14)' }}
                >
                  {step.number}
                </span>
                <h3 className="type-h3 mt-3">{step.title}</h3>
                <p className="type-body mt-3 text-[0.95rem]">{step.description}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
    {/* Breathing room before the FAQ. */}
    <div aria-hidden="true" style={{ height: '40vh' }} />
    </>
  )
}
