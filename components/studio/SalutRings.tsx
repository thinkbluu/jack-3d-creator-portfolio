'use client'

import GoogleReviews from '@/components/GoogleReviews'
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
        eyebrow: project.type === 'concept' ? `${copy.concept} · ${project.year}` : `${project.categoryLabel} · ${project.year}`,
        title: project.name,
        text: project.summary,
      }))}
    />
  )
}

/**
 * Client reviews: the orbit once there are enough real review cards in
 * lib/reviews.ts, the Google widget until then.
 */
export function ReviewsBlock() {
  const { redesign } = useUi()
  const copy = redesign.salut
  if (reviewCards.length >= 5) {
    return (
      <SalutOrbit
        tone="cream"
        title={copy.reviewsTitle}
        intro={copy.reviewsIntro}
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
  return (
    <div className="tone-cream relative py-24 md:py-32">
      <div className="studio-container">
        <GoogleReviews bare />
      </div>
    </div>
  )
}
