'use client'

import { useLocale, useUi } from '@/lib/i18n/context'
import { reviewCards } from '@/lib/reviews'
import SalutOrbit from './SalutOrbit'

/**
 * Client reviews: the orbit of real review cards from lib/reviews.ts. With
 * fewer than five cards the section renders nothing at all.
 */
export function ReviewsBlock() {
  const locale = useLocale()
  const { redesign } = useUi()
  const copy = redesign.salut
  const reviewsUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL
  if (reviewCards.length < 5) return null
  return (
    <SalutOrbit
      tone="dark"
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
        alt: locale === 'en' ? review.altEn : review.alt,
        eyebrow: review.rating ? '★'.repeat(review.rating) : undefined,
        quote: review.quote,
        title: review.author,
        text: review.business,
      }))}
    />
  )
}
