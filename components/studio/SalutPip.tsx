'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useLocale, useUi } from '@/lib/i18n/context'
import { getAllProjects } from '@/lib/projects'

/**
 * A small floating window in the corner that keeps playing our live work,
 * like a picture-in-picture showreel. It steps aside while the work itself
 * is on screen and near the end of the page.
 */
export default function SalutPip() {
  const locale = useLocale()
  const { redesign } = useUi()
  const projects = getAllProjects(locale).filter((project) => project.type === 'client' && project.cover)
  const [shot, setShot] = useState(0)
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = reduced ? 0 : window.setInterval(() => setShot((value) => (value + 1) % projects.length), 2600)
    const work = document.getElementById('lucrari')
    let inWork = false
    let atTop = true
    let atEnd = false
    const update = () => setHidden(inWork || atTop || atEnd)
    const onScroll = () => {
      const y = window.__lenis?.scroll ?? window.scrollY
      atTop = y < window.innerHeight * 0.6
      atEnd = y + window.innerHeight > document.documentElement.scrollHeight - window.innerHeight * 1.4
      update()
    }
    const observer = new IntersectionObserver(([entry]) => {
      inWork = entry.isIntersecting
      update()
    })
    if (work) observer.observe(work)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.clearInterval(timer)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [projects.length])

  return (
    <a href="#lucrari" className="salut-pip" data-hidden={hidden ? '1' : undefined} aria-label={redesign.salut.pip} tabIndex={hidden ? -1 : 0}>
      {projects.map((project, index) => (
        <span key={project.slug} className="salut-pip-shot" data-on={index === shot ? '1' : undefined}>
          <Image src={project.cover} alt={project.coverAlt} fill sizes="260px" className="object-cover object-[right_center]" />
        </span>
      ))}
      <span className="salut-pip-label mono-label">
        <span aria-hidden="true" className="salut-pip-dot" /> {redesign.salut.pip}
      </span>
    </a>
  )
}
