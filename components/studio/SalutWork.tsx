'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useHref, useLocale, useUi } from '@/lib/i18n/context'
import { getAllProjects } from '@/lib/projects'

/**
 * The work, big. A pinned row of large rounded cards that vertical scroll
 * moves sideways; each card is a full-bleed screenshot with the project's
 * name and promise set large over it. Phones get a native swipe row.
 */
export default function SalutWork() {
  const locale = useLocale()
  const href = useHref()
  const { redesign } = useUi()
  const copy = redesign.salut
  const work = redesign.work
  const projects = getAllProjects(locale).filter((project) => project.type === 'client' && project.cover)
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    const desktop = window.matchMedia('(min-width: 768px)')
    const measure = () => setDistance(desktop.matches ? Math.max(0, track.scrollWidth - window.innerWidth) : 0)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    desktop.addEventListener('change', measure)

    let raf = 0
    let running = false
    let x = 0
    const tick = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0
      const max = Math.max(0, track.scrollWidth - window.innerWidth)
      const target = desktop.matches ? -p * max : 0
      x += (target - x) * 0.14
      track.style.transform = desktop.matches ? `translate3d(${x.toFixed(1)}px,0,0)` : ''
      // Cards settle to full size as they reach the middle.
      const mid = window.innerWidth / 2
      for (const card of Array.from(track.querySelectorAll<HTMLElement>('[data-card]'))) {
        const box = card.getBoundingClientRect()
        const d = Math.min(1, Math.abs(box.left + box.width / 2 - mid) / window.innerWidth)
        card.style.setProperty('--d', d.toFixed(3))
      }
      if (running) raf = requestAnimationFrame(tick)
    }
    const visibility = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting
      if (running && !raf) raf = requestAnimationFrame(tick)
    })
    visibility.observe(section)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      visibility.disconnect()
      desktop.removeEventListener('change', measure)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="lucrari"
      aria-labelledby="salut-work"
      className="tone-dark salut-work relative"
      style={distance ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className="md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center md:overflow-hidden">
        <div className="studio-container flex items-end justify-between gap-8 pt-24 md:pt-[clamp(5.5rem,12svh,7.5rem)]">
          <h2 id="salut-work" className="salut-head display-xl">
            {copy.workTitle}
          </h2>
          <p className="mb-3 hidden max-w-xs text-[var(--fg-2)] md:block">{copy.workIntro}</p>
        </div>
        <div
          ref={trackRef}
          className="salut-track mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(1.25rem,3vw,2.5rem)] pb-10 [scrollbar-width:none] md:mt-10 md:w-max md:snap-none md:gap-8 md:overflow-visible md:pb-0"
        >
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={href(`/portofoliu/${project.slug}`)}
              data-card=""
              data-cursor={redesign.cursor.view}
              className="salut-card link-block group snap-start"
            >
              <span className="salut-card-media">
                <Image
                  src={project.cover}
                  alt={project.coverAlt}
                  width={2048}
                  height={1024}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
                  className="h-full w-full object-cover object-[right_center] transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03]"
                />
              </span>
              <span className="salut-card-shade" aria-hidden="true" />
              <span className="salut-card-text">
                <span className="mono-label text-[var(--brass-lite)]">
                  {project.categoryLabel} · {project.year}
                </span>
                <span className="salut-card-name display-xl">{project.name}.</span>
                <span className="salut-card-sum">{project.summary}</span>
              </span>
            </Link>
          ))}
          <Link href={href('/portofoliu')} data-card="" className="salut-card salut-card-all link-block">
            <span className="display-italic">{work.all}</span>
            <span aria-hidden="true" className="text-4xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
