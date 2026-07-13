'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { memo, useState } from 'react'
import FadeIn from './FadeIn'

const faqs = [
  ['Cine scrie textele site-ului?', 'Noi. Copywriting-ul e inclus în preț: tu ne dai informațiile brute despre afacere, noi le transformăm în texte care vând.'],
  ['Ce se întâmplă dacă nu îmi place rezultatul?', 'Plătești 100% doar când ești mulțumit. Prima rundă de revizii este inclusă.'],
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
  return (
    <section id="faq" className="section-shell bg-[var(--bg)]">
      <div className="site-container">
        <FadeIn><header className="section-header"><p className="type-kicker mb-4">Clarificări</p><h2 className="type-h2">Înainte de îmbarcare</h2></header></FadeIn>
        <div className="overflow-hidden rounded-[20px] border border-[var(--line)]">
          {faqs.map(([question, answer], index) => <FAQItem key={question} question={question} answer={answer} delay={index * 0.08} />)}
        </div>
      </div>
    </section>
  )
}
