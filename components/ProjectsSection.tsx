'use client'

import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import FadeIn from './FadeIn'
import LiveProjectButton from './LiveProjectButton'
import ChartKicker from './ChartKicker'

const projects = [
  { number: '01', name: '[PROIECT_1]', year: '2026', href: '', col1: ['https://placehold.co/1280x720/0B1424/C9A86A?text=PROIECT_1+01', 'https://placehold.co/1280x960/0B1424/C9A86A?text=PROIECT_1+02'], col2: 'https://placehold.co/1280x1280/0B1424/C9A86A?text=PROIECT_1+03' },
  { number: '02', name: '[PROIECT_2]', year: '2026', href: '', col1: ['https://placehold.co/1280x720/0B1424/C9A86A?text=PROIECT_2+01', 'https://placehold.co/1280x960/0B1424/C9A86A?text=PROIECT_2+02'], col2: 'https://placehold.co/1280x1280/0B1424/C9A86A?text=PROIECT_2+03' },
  { number: '03', name: '[PROIECT_3]', year: '2026', href: '', col1: ['https://placehold.co/1280x720/0B1424/C9A86A?text=PROIECT_3+01', 'https://placehold.co/1280x960/0B1424/C9A86A?text=PROIECT_3+02'], col2: 'https://placehold.co/1280x1280/0B1424/C9A86A?text=PROIECT_3+03' },
]

function PortStamp({ year }: { year: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className="h-16 w-16 shrink-0"
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={reduceMotion ? undefined : { duration: 60, ease: 'linear', repeat: Infinity }}
    >
      <circle cx="32" cy="32" r="28" fill="none" stroke="var(--gold)" strokeDasharray="3 4" strokeOpacity="0.5" />
      <path d="M32 14c.8 4.6 2 6.2 5.5 8-3.5 1.8-4.7 3.4-5.5 8-.8-4.6-2-6.2-5.5-8 3.5-1.8 4.7-3.4 5.5-8Z" fill="var(--gold)" fillOpacity="0.72" />
      <text x="32" y="43" fill="var(--gold)" fillOpacity="0.8" fontSize="9" fontWeight="800" letterSpacing="0.04em" textAnchor="middle">{year}</text>
    </motion.svg>
  )
}

function isRealUrl(href: string) {
  try {
    return Boolean(href) && href !== '#' && ['http:', 'https:'].includes(new URL(href).protocol)
  } catch {
    return false
  }
}

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (projects.length - 1 - index) * 0.03])
  return (
    <div ref={ref} className="flex h-[85vh] items-start justify-center" style={{ paddingTop: `${index * 28}px` }}>
      <motion.article className="sticky top-24 w-full rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-4 md:top-32 md:p-8" style={{ scale, transformOrigin: 'top center' }}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="type-kicker text-pretty">ESCALA {project.number} · {project.name} · {project.year}</p>
            <h3 className="type-h3 mt-3 text-[var(--text)]">{project.name}</h3>
            {isRealUrl(project.href) && <div className="mt-5"><LiveProjectButton /></div>}
          </div>
          <PortStamp year={project.year} />
        </div>
        <div className="flex gap-3">
          <div className="flex w-2/5 flex-col gap-3">
            <Image src={project.col1[0]} alt={`${project.name} preview 1`} width={1280} height={720} sizes="(max-width: 768px) 40vw, 34vw" className="h-[clamp(130px,16vw,230px)] w-full rounded-[20px] object-cover" />
            <Image src={project.col1[1]} alt={`${project.name} preview 2`} width={1280} height={960} sizes="(max-width: 768px) 40vw, 34vw" className="h-[clamp(160px,22vw,340px)] w-full rounded-[20px] object-cover" />
          </div>
          <div className="w-3/5"><Image src={project.col2} alt={`${project.name} preview 3`} width={1280} height={1280} sizes="(max-width: 768px) 60vw, 51vw" className="h-full w-full rounded-[20px] object-cover" /></div>
        </div>
      </motion.article>
    </div>
  )
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="section-shell bg-[var(--bg)]">
      <div className="site-container">
        <FadeIn><header className="section-header"><ChartKicker bearing="07" label="Escale" /><h2 className="type-h2">Escale</h2><p className="type-body mt-5">Fiecare proiect e un port în care am lăsat ceva mai bun decât am găsit.</p></header></FadeIn>
        {projects.map((project, index) => <ProjectCard key={project.number} project={project} index={index} />)}
      </div>
    </section>
  )
}
