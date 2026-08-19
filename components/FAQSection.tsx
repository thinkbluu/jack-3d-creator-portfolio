'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import FadeIn from './FadeIn'
import ChartKicker from './ChartKicker'
import { getWaUrl, useSegment } from './SegmentContext'

const faqs: Array<[string, string]> = [
  [
    'Cât costă un site în România, concret?',
    'La noi prețurile sunt la vedere: site de prezentare de la 300 EUR, magazin online de la 900 EUR, aplicații și platforme cu ofertă personalizată în 24h. Avansul e 50 EUR și se scade din preț. Fără costuri ascunse: îți spunem de la început și cât costă domeniul și găzduirea, de regulă sub 100 EUR pe an, plătite direct de tine, pe numele tău.',
  ],
  [
    'Site de prezentare sau magazin online, ce mi se potrivește?',
    'Simplu: dacă vrei ca oamenii să te găsească, să aibă încredere și să te contacteze, îți trebuie site de prezentare. Dacă vrei să plătească produse direct pe site, cu cardul, îți trebuie magazin online. Dacă nu ești sigur, ne scrii pe WhatsApp și îți spunem sincer, chiar dacă răspunsul e varianta mai ieftină.',
  ],
  [
    'Chiar e gata în 48 de ore?',
    'Da, pentru site-uri de prezentare de până la 5 pagini. Cronometrul pornește când avem materialele complete de la tine, ghidate de lista noastră scurtă. Magazinele online au nevoie de 7 zile. Termenul e scris în contract, nu spus din vârful buzelor.',
  ],
  [
    'Ce trebuie să vă dau eu ca să începem?',
    'Puțin: sigla dacă ai, câteva poze, informațiile de bază despre afacere și lista de servicii sau produse cu prețuri. Primești de la noi o listă clară cu tot ce ne trebuie, iar ce lipsește rezolvăm împreună.',
  ],
  [
    'Cine scrie textele și cine face designul?',
    'Noi, și e inclus în preț. Tu ne dai informațiile brute, noi le transformăm în texte care conving și într-un design făcut doar pentru tine. Tu doar aprobi.',
  ],
  [
    'Ce se întâmplă dacă nu îmi place rezultatul?',
    'Vezi site-ul finalizat, live, înainte să plătești restul. Prima rundă de modificări e inclusă. Dacă nici după aceea nu ne întâlnim, te oprești: rămâi doar cu avansul de 50 EUR, păstrezi analiza și direcția făcute pentru afacerea ta, iar site-ul rămâne la noi. Riscul mare e la noi, nu la tine.',
  ],
  [
    'Site-ul e al meu sau rămân legat de voi?',
    'E al tău, cu totul: domeniul se cumpără pe numele firmei tale, accesele îți aparțin, iar dacă vreodată vrei să pleci, pleci cu tot. Nu credem în clienți ținuți captivi.',
  ],
  [
    'De ce nu folosiți teme WordPress, ca alții?',
    'Pentru că temele de-a gata vin cu balast: sunt lente, seamănă între ele și se strică la actualizări. Noi construim site-ul de la zero, doar cu ce îți trebuie ție. De-asta putem garanta viteza și de-asta site-ul tău nu arată ca al concurenței.',
  ],
  [
    'De ce contează atât de mult viteza site-ului?',
    'Pentru că oamenii nu așteaptă: dacă site-ul se încarcă greu pe telefon, pleacă în câteva secunde, iar Google te coboară în căutări. Site-urile noastre se deschid instant, garantat la predare, și asta se vede direct în numărul de clienți care rămân.',
  ],
  [
    'Merită să plătesc mentenanță lunară?',
    'Dacă vrei doar ca site-ul să existe, nu neapărat. Dacă vrei să urce în Google, să fie mereu sigur și actualizat și să ai pe cineva care răspunde când vrei o modificare, da. De la 90 EUR pe lună, fără contract pe termen lung: renunți oricând.',
  ],
  [
    'Faceți și aplicații sau platforme mai complexe?',
    'Da, de la aplicații interne care îți scutesc ore de muncă repetitivă până la platforme complete cu conturi și abonamente. Ne spui ideea pe WhatsApp și primești în 24h o părere sinceră: ce merită construit, cât durează și cât costă.',
  ],
  [
    'Cum îmi dau seama dacă o firmă de web design e serioasă?',
    'Cere trei lucruri: preț clar înainte să pornești, termen scris în contract și dovada că vezi rezultatul înainte de plata finală. Dacă primești răspunsuri vagi la oricare, mergi mai departe. Noi le punem pe toate trei pe masă din primul mesaj.',
  ],
]

// Groups reference `faqs` by index, so the source list stays the single
// source of truth for both the UI and the FAQPage structured data.
const groups: Array<{ kicker: string; indices: number[] }> = [
  { kicker: 'Bani și termene', indices: [5, 0, 1, 2, 9] },
  { kicker: 'Cum lucrăm', indices: [3, 4] },
  { kicker: 'Tehnic și proprietate', indices: [6, 7, 8, 10, 11] },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  delay,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  delay: number
}) {
  return (
    <FadeIn delay={delay}>
      <article className="border-b border-[var(--hairline)] last:border-b-0">
        <button
          type="button"
          className="flex min-h-[52px] w-full cursor-pointer items-center justify-between gap-6 py-5 text-left"
          aria-expanded={isOpen}
          onClick={onToggle}
        >
          <span className="type-h3">{question}</span>
          <Plus
            className={`shrink-0 text-[var(--brass)] transition-transform duration-[250ms] ${isOpen ? 'rotate-45' : ''}`}
            size={20}
            aria-hidden="true"
          />
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <p className="type-body pb-6 text-[0.95rem]">{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    </FadeIn>
  )
}

export default function FAQSection() {
  const { segment } = useSegment()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="scene-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="porthole scene-panel" style={{ maxWidth: '900px' }}>
        <FadeIn>
          <ChartKicker label="Înainte de îmbarcare" />
          <h2 className="type-h2 text-balance">Întrebări frecvente.</h2>
        </FadeIn>
        {groups.map((group) => (
          <div key={group.kicker} className="mt-10 first-of-type:mt-8">
            <FadeIn>
              <p className="kicker mb-2">{group.kicker}</p>
            </FadeIn>
            {group.indices.map((index, positionInGroup) => {
              const [question, answer] = faqs[index]
              return (
                <FAQItem
                  key={question}
                  question={question}
                  answer={answer}
                  // openIndex holds a global index, so only one row is ever open
                  // across all three groups.
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
                  delay={Math.min(positionInGroup, 5) * 0.06}
                />
              )
            })}
          </div>
        ))}
        <p className="type-body mt-9">
          Altă întrebare? Răspundem în aceeași zi.{' '}
          <a
            href={getWaUrl(segment)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--brass)] underline decoration-[var(--glass-edge)] underline-offset-4 transition-colors hover:text-[var(--ink)]"
          >
            Scrie-ne →
          </a>
        </p>
      </div>
    </section>
  )
}
