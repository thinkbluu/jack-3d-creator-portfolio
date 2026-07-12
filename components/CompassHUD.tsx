'use client'

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Compass } from 'lucide-react'
import { useEffect, useState } from 'react'

const sections = [
  { id: 'home', label: 'ACASĂ' },
  { id: 'projects', label: 'PROIECTE' },
  { id: 'about', label: 'DESPRE' },
  { id: 'services', label: 'SERVICII' },
  { id: 'process', label: 'PROCES' },
  { id: 'contact', label: 'CONTACT' },
]

export default function CompassHUD() {
  const [supportsHUD, setSupportsHUD] = useState(false)
  const [currentSection, setCurrentSection] = useState('ACASĂ')
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 360])

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    const update = () => setSupportsHUD(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!supportsHUD) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const next = sections.find((section) => section.id === visible.target.id)
        if (next) setCurrentSection(next.label)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.01, 0.25, 0.5] },
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [supportsHUD])

  if (!supportsHUD) return null

  return (
    <button
      type="button"
      aria-label="Înapoi sus"
      onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })}
      className="fixed bottom-8 right-8 z-40 flex w-24 flex-col items-center gap-2 opacity-70 transition-opacity duration-200 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]"
    >
      <motion.span
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center text-[var(--gold)] opacity-60 drop-shadow-[0_8px_14px_rgba(0,0,0,0.3)]"
        style={reduceMotion ? undefined : { rotate: rotation }}
      >
        <Compass className="h-14 w-14" strokeWidth={1.25} />
      </motion.span>
      <span className="relative h-4 w-full overflow-hidden text-center text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[var(--text-3)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0"
          >
            {currentSection}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  )
}
