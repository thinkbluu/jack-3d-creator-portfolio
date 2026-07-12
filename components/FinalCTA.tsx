import ContactButton from './ContactButton'
import FadeIn from './FadeIn'
import ChartKicker from './ChartKicker'

export default function FinalCTA() {
  return (
    <section id="contact" className="hero-chart-grid section-shell border-t border-[var(--line)] bg-[var(--bg)]">
      <div className="site-container">
        <FadeIn>
          <header className="section-header">
            <ChartKicker bearing="06" label="Contact" />
            <h2 className="type-h2">Setează <span className="text-[var(--gold)]">direcția.</span></h2>
            <p className="type-body mt-5">Lucrăm cu maximum 4 proiecte noi pe lună. Rezervă-ți locul.</p>
          </header>
          <div className="flex justify-start"><ContactButton /></div>
        </FadeIn>
      </div>
    </section>
  )
}
