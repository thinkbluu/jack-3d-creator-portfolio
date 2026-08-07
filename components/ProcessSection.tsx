import FadeIn from './FadeIn'
import ChartKicker from './ChartKicker'

const steps = [
  {
    number: '01',
    title: 'Ne scrii pe WhatsApp',
    description: 'Ne spui în două fraze ce faci și ce îți trebuie. În aceeași zi primești oferta clară și lista scurtă de materiale de care avem nevoie.',
  },
  {
    number: '02',
    title: 'Rezervi locul cu 50 EUR',
    description: 'Avansul se scade din preț și pornește lucrul: ne trimiți textele de bază, pozele și sigla, ghidat de lista noastră. De aici pornește cronometrul.',
  },
  {
    number: '03',
    title: 'Vezi site-ul live și decizi',
    description: 'În 48 de ore pentru site-uri de prezentare, 7 zile pentru magazine. Îl vezi gata, pe internet, și plătești restul doar dacă ești mulțumit. Dacă nu, rămâi doar cu avansul și cu analiza făcută pentru tine.',
  },
]

export default function ProcessSection() {
  return (
    <section id="process" className="scene-section">
      <div className="porthole scene-panel">
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
  )
}
