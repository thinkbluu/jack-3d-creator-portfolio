import FadeIn from './FadeIn'
import ChartKicker from './ChartKicker'

const rows = [
  {
    service: 'Site de prezentare',
    includes: 'Design unic, texte scrise de noi, până la 5 pagini, versiune mobilă, buton WhatsApp',
    term: '48 de ore',
    price: 'de la 300 EUR',
  },
  {
    service: 'Magazin online',
    includes: 'Catalog, plăți cu cardul, comenzi, facturare automată',
    term: '7 zile',
    price: 'de la 900 EUR',
  },
  {
    service: 'Aplicație web sau mobilă',
    includes: 'Analiză, design, dezvoltare, lansare',
    term: 'după evaluare',
    price: 'ofertă în 24h',
  },
  {
    service: 'Platformă sau SaaS',
    includes: 'Conturi, abonamente, plăți, panou de administrare',
    term: 'după evaluare',
    price: 'ofertă în 24h',
  },
]

const priceClass = 'font-sans text-[15px] font-bold text-[var(--brass)]'
const fieldLabelClass = 'mb-1 block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-3)]'

export default function PricingSection() {
  return (
    <section id="preturi" className="scene-section">
      <div className="porthole scene-panel mx-auto" style={{ maxWidth: 1000 }}>
        <FadeIn>
          <ChartKicker label="Prețuri" />
          <h2 className="type-h2 text-balance">Cât costă, exact.</h2>
        </FadeIn>

        {/* Desktop / tablet: a real comparable table, scannable at a glance. */}
        <FadeIn delay={0.06} className="hidden md:block">
          <table className="mt-8 w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--hairline)] text-left">
                <th scope="col" className={`${fieldLabelClass} pb-3 pr-4`}>
                  Serviciu
                </th>
                <th scope="col" className={`${fieldLabelClass} pb-3 pr-4`}>
                  Ce include
                </th>
                <th scope="col" className={`${fieldLabelClass} pb-3 pr-4`}>
                  Termen
                </th>
                <th scope="col" className={`${fieldLabelClass} pb-3`}>
                  Preț
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.service} className="border-b border-[var(--hairline)] last:border-b-0">
                  <td className="type-h3 py-4 pr-4 align-top text-[1rem]">{row.service}</td>
                  <td className="type-body py-4 pr-4 align-top text-[0.92rem]">{row.includes}</td>
                  <td className="type-body py-4 pr-4 align-top text-[0.92rem] whitespace-nowrap">{row.term}</td>
                  <td className={`${priceClass} py-4 align-top whitespace-nowrap`}>{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </FadeIn>

        {/* Mobile: the same four rows as stacked cards, each field prefixed with its column label. */}
        <div className="mt-8 flex flex-col gap-4 md:hidden">
          {rows.map((row, index) => (
            <FadeIn key={row.service} delay={0.06 + index * 0.05} className="rounded-[var(--radius-card)] border border-[var(--hairline)] p-5">
              <p>
                <span className={fieldLabelClass}>Serviciu</span>
                <span className="type-h3 text-[1rem]">{row.service}</span>
              </p>
              <p className="mt-3">
                <span className={fieldLabelClass}>Ce include</span>
                <span className="type-body text-[0.92rem]">{row.includes}</span>
              </p>
              <p className="mt-3">
                <span className={fieldLabelClass}>Termen</span>
                <span className="type-body text-[0.92rem]">{row.term}</span>
              </p>
              <p className="mt-3">
                <span className={fieldLabelClass}>Preț</span>
                <span className={priceClass}>{row.price}</span>
              </p>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.12} className="mt-6 flex flex-col gap-1">
          <p className="type-body text-sm text-[var(--ink-2)]">
            Avansul de 50 EUR se scade din preț. Restul se plătește la livrare, doar dacă ești mulțumit.
          </p>
          <p className="type-body text-sm text-[var(--ink-2)]">
            Nu sunt incluse: domeniul și găzduirea (sub 100 EUR pe an, pe numele tău) și fotografiile profesionale.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
