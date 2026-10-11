'use client'

import { useHref, useLocale, useUi } from '@/lib/i18n/context'
import { getAllProjects } from '@/lib/projects'
import { reviewCards } from '@/lib/reviews'
import SalutOrbit from './SalutOrbit'

/** Project results in the orbit: every project, client and concept. */
export function ProjectOrbit() {
  const locale = useLocale()
  const href = useHref()
  const { redesign } = useUi()
  const copy = redesign.salut
  const projects = getAllProjects(locale).filter((project) => project.cover)
  return (
    <SalutOrbit
      title={copy.orbitTitle}
      intro={copy.orbitIntro}
      cards={projects.map((project) => ({
        key: project.slug,
        href: href(`/portofoliu/${project.slug}`),
        image: project.cover,
        alt: project.coverAlt,
        eyebrow: project.type === 'concept' ? `${copy.concept} · ${project.year}` : `${project.categoryLabel} · ${project.year}`,
        title: project.name,
        text: project.summary,
      }))}
    />
  )
}

/**
 * Client reviews: the orbit of real review cards from lib/reviews.ts. With
 * fewer than five cards the section renders nothing at all.
 */
export function ReviewsBlock() {
  const { redesign } = useUi()
  const copy = redesign.salut
  const reviewsUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL
  if (reviewCards.length < 5) return null
  return (
    <SalutOrbit
      tone="cream"
      title={copy.reviewsTitle}
      intro={copy.reviewsIntro}
      cta={
        reviewsUrl ? (
          <a className="salut-orbit-cta-link" href={reviewsUrl} target="_blank" rel="noopener noreferrer">
            Toate recenziile pe Google ↗
          </a>
        ) : undefined
      }
      cards={reviewCards.map((review, index) => ({
        key: `${review.author}-${index}`,
        image: review.image,
        eyebrow: review.rating ? '★'.repeat(review.rating) : undefined,
        quote: review.quote,
        title: review.author,
        text: review.business,
      }))}
    />
  )
}
