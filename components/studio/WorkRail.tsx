'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useHref, useLocale, useUi } from '@/lib/i18n/context'
import { getAllProjects } from '@/lib/projects'
import { Kicker } from './Reveal'

/**
 * Selected work as a pinned horizontal gallery: vertical scroll drives the rail
 * sideways on desktop. On phones it is a native swipeable scroll-snap row.
 */
export default function WorkRail() {
  const locale = useLocale()
  const href = useHref()
  const { redesign } = useUi()
  const copy = redesign.work
  const projects = getAllProjects(locale).filter((project) => project.type === 'client')

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const desktop = window.matchMedia('(min-width: 768px)')
    const measure = () => setDistance(desktop.matches ? Math.max(0, track.scrollWidth - window.innerWidth) : 0)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    desktop.addEventListener('change', measure)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      desktop.removeEventListener('change', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const x = useTransform(smooth, (value) => -value * distance)
  const bar = useTransform(smooth, [0, 1], [0, 1])

  return (
    <section
      ref={sectionRef}
      id="lucrari"
      aria-labelledby="lucrari-titlu"
      className="tone-dark relative"
      style={distance ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className="grain relative py-24 md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center md:overflow-hidden md:py-0">
        <motion.div
          ref={trackRef}
          style={distance ? { x } : undefined}
          className="flex snap-x snap-mandatory scroll-px-[clamp(1.25rem,3vw,2.5rem)] gap-6 overflow-x-auto px-[clamp(1.25rem,3vw,2.5rem)] pb-6 [scrollbar-width:none] md:w-max md:snap-none md:gap-10 md:overflow-visible md:pb-0"
        >
          <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-end md:w-[34vw] md:max-w-[34rem]">
            <Kicker index="01" label={copy.kicker} className="text-[var(--fg-3)]" />
            <h2 id="lucrari-titlu" className="display-xl mt-6 text-balance text-[clamp(2.6rem,5.5vw,5.5rem)]">
              {copy.title}
            </h2>
            <p className="mt-6 max-w-sm text-[var(--fg-2)]">{copy.intro}</p>
            <span aria-hidden="true" className="mono-label mt-10 hidden text-[var(--fg-3)] md:block">
              ⟶
            </span>
          </div>

          {projects.map((project, index) => (
            <Link
              key={project.slug}
              href={href(`/portofoliu/${project.slug}`)}
              className="link-block group w-[82vw] shrink-0 snap-start md:w-[min(56vw,110svh)]"
            >
              <article>
                <div className="relative aspect-[2/1] overflow-hidden rounded-[6px] bg-[var(--navy)]">
                  <Image
                    src={project.cover}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 56vw, 82vw"
                    className="object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,15,22,0.55)] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="mono-label absolute bottom-4 left-4 translate-y-2 rounded-full bg-[var(--on-dark)] px-4 py-2 text-[var(--night)] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {copy.view} →
                  </span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <p className="mono-label text-[var(--fg-3)]">
                      <span className="text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span> · {project.categoryLabel} · {project.year}
                    </p>
                    <h3 className="display-xl mt-3 text-[clamp(1.8rem,2.8vw,2.8rem)] transition-colors group-hover:text-[var(--brass-lite)]">
                      {project.name}
                    </h3>
                  </div>
                  <span className="mono-label mt-1 flex shrink-0 items-center gap-2 text-[var(--fg-3)]">
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${project.status === 'in-lucru' ? 'bg-[var(--fg-3)]' : 'bg-[var(--brass-lite)]'}`}
                    />
                    {project.status === 'in-lucru' ? copy.inProgress : copy.live}
                  </span>
                </div>
                <p className="mt-3 max-w-xl text-[var(--fg-2)]">{project.summary}</p>
              </article>
            </Link>
          ))}

          <Link
            href={href('/portofoliu')}
            className="link-block group flex w-[60vw] shrink-0 snap-start items-center md:w-[26vw]"
          >
            <span className="flex aspect-square w-full flex-col items-center justify-center rounded-full border border-[var(--line)] text-center transition-colors duration-500 group-hover:border-[var(--brass-lite)] group-hover:bg-[var(--brass-lite)] group-hover:text-[var(--night)]">
              <span className="display-italic text-[clamp(1.6rem,2.4vw,2.4rem)]">{copy.all}</span>
              <span aria-hidden="true" className="mt-2 text-2xl">→</span>
            </span>
          </Link>
          <span aria-hidden="true" className="w-px shrink-0 md:w-[4vw]" />
        </motion.div>

        <div aria-hidden="true" className="studio-container mt-10 hidden md:block">
          <div className="h-px w-full bg-[var(--line)]">
            <motion.div className="h-px origin-left bg-[var(--brass-lite)]" style={{ scaleX: bar }} />
          </div>
        </div>
      </div>
    </section>
  )
}
