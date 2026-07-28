'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { memo, useState } from 'react'
import FadeIn from './FadeIn'
import { getWaUrl, useSegment } from './SegmentContext'

const faqs = [
  ['Cine scrie textele site-ului?', 'Noi. Copywriting-ul e inclus în preț: tu ne dai informațiile brute despre afacere, noi le transformăm în texte care vând.'],
  ['Ce se întâmplă dacă nu îmi place rezultatul?', 'Rezervi locul cu 50 EUR, avans care se scade din prețul final. Vezi site-ul finalizat, live, și plătești restul doar dacă ești mulțumit. Dacă nu ajungem la un rezultat comun, rămâi doar cu avansul, păstrezi analiza și direcția de design făcute pentru tine, iar site-ul rămâne al nostru.'],
  ['De ce avansul de 50 EUR?', 'Pentru că filtrează: lucrăm cu maximum 4 proiecte pe lună și vrem să le dedicăm timpul celor care chiar pornesc. Avansul se scade integral din preț și acoperă analiza afacerii tale și direcția de design, care rămân ale tale indiferent de decizie.'],
  ['Domeniul și hostingul sunt ale mele?', 'Da, integral. Domeniul se cumpără pe numele firmei tale, iar accesele îți aparțin.'],
  ['Chiar 48 de ore?', 'Da, pentru site-uri de prezentare de până la 5 pagini, din momentul primirii conținutului complet.'],
  ['Ce e inclus în preț?', 'Design unic, copywriting, implementare, SEO de bază, PageSpeed 90+, versiune mobilă și instructaj la predare.'],
] as const

const FAQItem = memo(function FAQItem({ question, answer, delay }: { question: string; answer: string; delay: number }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <FadeIn delay={delay}>
      <article className="border-b border-[var(--line)] transition-colors hover:bg-[var(--surface)]">
        <button type="button" className="flex w-full cursor-pointer items-center justify-between gap-6 px-5 py-6 text-left" aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
          <span className="type-h3 text-[var(--text)]">{question}</span>
          <Plus className={`shrink-0 text-[var(--text-2)] transition-transform ${isOpen ? 'rotate-45' : ''}`} size={20} aria-hidden="true" />
        </button>
        <AnimatePresence initial={false}>
          {isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }} className="overflow-hidden"><p className="type-body px-5 pb-6">{answer}</p></motion.div>}
        </AnimatePresence>
      </article>
    </FadeIn>
  )
})

export default function FAQSection() {
  const { segment } = useSegment()
  return (
    <section id="faq" className="section-shell bg-[var(--bg)]">
      <div className="site-container">
        <FadeIn><header className="section-header"><p className="type-kicker mb-4">Clarificări</p><h2 className="type-h2">Înainte de îmbarcare</h2></header></FadeIn>
        <div className="overflow-hidden rounded-[20px] border border-[var(--line)]">
          {faqs.map(([question, answer], index) => <FAQItem key={question} question={question} answer={answer} delay={index * 0.08} />)}
        </div>
        <p className="type-body mt-10 text-[var(--text-2)]">
          Altă întrebare? Răspundem în aceeași zi.{' '}
          <a
            href={getWaUrl(segment)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--gold)] hover:underline"
          >
            Scrie-ne →
          </a>
        </p>
      </div>
    </section>
  )
}
