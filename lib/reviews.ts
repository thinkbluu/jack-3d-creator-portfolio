/**
 * Client reviews shown as cards in the homepage orbit. Only real reviews go
 * here, copied word for word from Google (or with the client's written
 * permission), with the reviewer's name as published there.
 *
 * Add a card per review. `image` is optional: a portrait or a photo of the
 * business, 900 x 1200 px (3:4), saved as WebP in /public/reviews/.
 * While fewer than five cards exist, the homepage keeps the Google widget.
 */
export type ReviewCard = {
  /** The review text, as published. */
  quote: string
  /** Reviewer's name, as shown on Google. */
  author: string
  /** Their business or role, e.g. "Cabinet veterinar, Timișoara". */
  business?: string
  /** 1 to 5. */
  rating?: number
  /** e.g. "/reviews/ana-salon.webp" */
  image?: string
  /** Where the review was published. */
  source?: 'google' | 'facebook' | 'email'
}

export const reviewCards: ReviewCard[] = []
