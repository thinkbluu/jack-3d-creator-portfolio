'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import FadeIn from './FadeIn'

const faqs = [
  ['Cine scrie textele site-ului?', 'Noi. Copywriting-ul e inclus în preț: tu ne dai informațiile brute despre afacere, noi le transformăm în texte care vând. Tu doar aprobi.'],
  ['Ce se întâmplă dacă nu îmi place rezultatul?', 'Plătești 100% doar când ești mulțumit. Prima rundă de revizii e inclusă, iar în cazuri rare în care nu ajungem la un rezultat comun, rămâi fără nicio altă obligație.'],
  ['Domeniul și hostingul sunt ale mele?', 'Da, integral. Domeniul se cumpără pe numele firmei tale, iar accesele îți aparțin. Nu te legăm de noi: dacă vrei să pleci, pleci cu tot.'],
  ['Chiar 48 de ore?', 'Da, pentru site-uri de prezentare de până la 5 pagini: cronometrul pornește când primim conținutul complet, ghidat de checklist-ul nostru. Magazinele online au nevoie de 7 zile.'],
  ['Ce e inclus în preț?', 'Design unic, copywriting, implementare, optimizare SEO de bază, viteză PageSpeed 90+, versiune mobil impecabilă, legătura cu WhatsApp și instructaj la predare. Fără costuri ascunse.'],
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <section className="bg-[#050A14] px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="hero-heading mb-14 text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2rem, 7vw, 90px)' }}>
          Întrebări frecvente
        </h2>
        <div className="border-t border-[rgba(245,241,232,0.1)]">
          {faqs.map(([question, answer], index) => {
            const isOpen = openIndex === index
            return (
              <FadeIn key={question} delay={index * 0.08} y={16}>
                <div className="border-b border-[rgba(245,241,232,0.1)]">
                  <button type="button" className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left" aria-expanded={isOpen} onClick={() => setOpenIndex(isOpen ? null : index)}>
                    <span className="text-base font-medium text-[#F5F1E8] sm:text-lg">{question}</span>
                    <Plus className={`shrink-0 text-[#C9A227] transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} size={20} aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
                        <p className="pb-6 text-sm font-light leading-relaxed text-[#F5F1E8] opacity-55 sm:text-base">{answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
