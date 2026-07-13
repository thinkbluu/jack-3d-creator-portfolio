'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import FadeIn from './FadeIn'
import LiveProjectButton from './LiveProjectButton'
import ChartKicker from './ChartKicker'

const projects = [
  { number: '01', category: 'Client', name: 'Nextlevel Studio', col1: ['https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85', 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85'], col2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85' },
  { number: '02', category: 'Personal', name: 'Aura Brand Identity', col1: ['https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85', 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85'], col2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85' },
  { number: '03', category: 'Client', name: 'Solaris Digital', col1: ['https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85', 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85'], col2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85' },
]

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (projects.length - 1 - index) * 0.03])
  return (
    <div ref={ref} className="flex h-[85vh] items-start justify-center" style={{ paddingTop: `${index * 28}px` }}>
      <motion.article className="sticky top-24 w-full rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-4 md:top-32 md:p-8" style={{ scale, transformOrigin: 'top center' }}>
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <span className="text-transparent" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, WebkitTextStroke: '1px rgba(245,241,232,0.18)' }}>{project.number}</span>
          <div className="flex-1"><p className="type-kicker mb-2">{project.category}</p><h3 className="type-h3 text-[var(--text)]">{project.name}</h3></div>
          <LiveProjectButton />
        </div>
        <div className="flex gap-3">
          <div className="flex w-2/5 flex-col gap-3">
            <img src={project.col1[0]} alt={`${project.name} preview 1`} width={1280} height={720} loading="lazy" decoding="async" className="h-[clamp(130px,16vw,230px)] w-full rounded-[20px] object-cover" />
            <img src={project.col1[1]} alt={`${project.name} preview 2`} width={1280} height={960} loading="lazy" decoding="async" className="h-[clamp(160px,22vw,340px)] w-full rounded-[20px] object-cover" />
          </div>
          <div className="w-3/5"><img src={project.col2} alt={`${project.name} preview 3`} width={1280} height={1280} loading="lazy" decoding="async" className="h-full w-full rounded-[20px] object-cover" /></div>
        </div>
      </motion.article>
    </div>
  )
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="section-shell bg-[var(--bg)]">
      <div className="site-container">
        <FadeIn><header className="section-header"><ChartKicker bearing="06" label="Proiecte" /><h2 className="type-h2">Proiecte</h2><p className="type-body mt-5">Identități și produse digitale construite pentru claritate, încredere și creștere.</p></header></FadeIn>
        {projects.map((project, index) => <ProjectCard key={project.number} project={project} index={index} />)}
      </div>
    </section>
  )
}
