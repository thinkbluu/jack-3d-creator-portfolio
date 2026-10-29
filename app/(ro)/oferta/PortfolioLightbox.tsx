'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

type LightboxProject = {
  name: string
  cover: string
  coverAlt: string
}

/**
 * Portfolio cards that open the project cover in a lightbox. No outbound
 * navigation: the ad visitor stays on the landing page.
 */
export default function PortfolioLightbox({ projects }: { projects: LightboxProject[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (openIndex === null) return
    closeRef.current?.focus()
    window.__lenis?.stop()
    document.documentElement.classList.add('overflow-hidden')
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.__lenis?.start()
      document.documentElement.classList.remove('overflow-hidden')
      window.removeEventListener('keydown', onKey)
    }
  }, [openIndex])

  const open = openIndex === null ? null : projects[openIndex]

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2">
        {projects.map((project, index) => (
          <li key={project.name}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
              aria-label={`Vezi imaginea proiectului ${project.name} mărită`}
            >
              <span className="relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-[var(--hairline)]">
                <Image
                  src={project.cover}
                  alt={project.coverAlt}
                  fill
                  sizes="(min-width: 640px) 40vw, 92vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </span>
              <span className="mt-3 flex items-baseline justify-between gap-4">
                <span className="font-display text-lg text-[var(--ink)]">{project.name}</span>
                <span className="mono-label shrink-0 text-[var(--fg-3)]">Vezi mare</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Imagine proiect: ${open.name}`}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(20,16,12,0.88)] p-4 md:p-10"
          onClick={() => setOpenIndex(null)}
        >
          <figure className="relative max-h-full w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <div className="relative aspect-[4/3] max-h-[80svh] w-full overflow-hidden rounded-[var(--radius-card)]">
              <Image src={open.cover} alt={open.coverAlt} fill sizes="90vw" className="object-contain" />
            </div>
            <figcaption className="mt-3 text-center font-display text-lg text-[#faf7f2]">{open.name}</figcaption>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="Închide imaginea"
              className="absolute -top-12 right-0 grid size-11 cursor-pointer place-items-center rounded-full border border-[rgba(250,247,242,0.3)] text-[#faf7f2] transition-colors hover:bg-[rgba(250,247,242,0.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </figure>
        </div>
      ) : null}
    </>
  )
}
