'use client'

import { motion, useReducedMotion } from 'framer-motion'
import ChartKicker from './ChartKicker'
import { PHONE_DISPLAY, PHONE_HREF, EMAIL, EMAIL_HREF } from './SegmentContext'

const EASE = [0.22, 1, 0.36, 1] as const

const principles = [
  {
    title: 'Analiză înainte de design',
    body: 'Nu deschidem editorul până nu înțelegem ce vinzi, cui vinzi și de ce te-ar alege pe tine. Din discuția asta iese structura site-ului, nu din șabloane.',
  },
  {
    title: 'Un singur proiect, atenție completă',
    body: 'Lucrăm cu puține proiecte simultan, exact ca să putem livra în 48 de ore fără să tăiem colțuri. Nu ești pe o listă de așteptare de trei luni.',
  },
  {
    title: 'Aceiași pași, de fiecare dată',
    body: 'Analiză, structură, texte, design, testare, lansare. Fiecare etapă are un livrabil pe care îl vezi, nu o promisiune că se lucrează la el.',
  },
  {
    title: 'Predare completă, nu doar un link',
    body: 'Primești accesele, documentația și un instructaj de folosire. Site-ul e al tău din prima zi, cu tot ce trebuie ca să te descurci și fără noi.',
  },
]

export default function StudioSection() {
  const reduceMotion = useReducedMotion()
  const riseY = reduceMotion ? 0 : 18
  const duration = reduceMotion ? 0 : 0.7

  return (
    <section id="studio" className="scene-section">
      <div className="porthole scene-panel" style={{ maxWidth: '940px', marginInline: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: riseY }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration, ease: EASE }}
        >
          <ChartKicker label="Studioul" />
          <h2 className="type-h2 text-balance">Un studio mic, cu procese de firmă mare.</h2>
          <p className="type-body mt-6 max-w-[60ch]">
            MAST Studio face parte din MAST Consult, o firmă de consultanță din Timișoara cu experiență în
            strategie, finanțare și proiecte digitale. Aducem aceeași disciplină și în web design: analiză
            înainte de execuție, procese clare și livrare la termen.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: riseY }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration, delay: reduceMotion ? 0 : index * 0.09, ease: EASE }}
            >
              <h3 className="type-h3">{principle.title}</h3>
              <p className="type-body mt-2 text-[15px]">{principle.body}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-7 text-center text-sm text-[var(--ink-2)]">
          Scrii, răspundem. Direct.{' '}
          <a href={PHONE_HREF} className="transition-colors hover:text-[var(--brass)]">
            {PHONE_DISPLAY}
          </a>
          {' · '}
          <a href={EMAIL_HREF} className="transition-colors hover:text-[var(--brass)]">
            {EMAIL}
          </a>
        </p>
      </div>
    </section>
  )
}
