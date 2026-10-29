/**
 * Client reviews shown as cards in the homepage orbit. Only real reviews go
 * here, copied word for word from Google (or with the client's written
 * permission), with the reviewer's name as published there.
 *
 * Add a card per review. `image` is optional: a portrait or a photo of the
 * business, 900 x 1200 px (3:4), saved as WebP in /public/reviews/.
 * The homepage shows the review ring only once there are at least five cards.
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
  /** Alt text for the image, in Romanian. */
  alt?: string
  /** Alt text for the image, in English. */
  altEn?: string
  /** Where the review was published. */
  source?: 'google' | 'facebook' | 'email'
}

export const reviewCards: ReviewCard[] = [
  // Ordered so long and short quotes alternate around the ring.
  {
    author: 'Eduard',
    alt: 'Recenzie Google de la Eduard',
    altEn: 'Google review from Eduard',
    quote:
      'Colaborarea cu MAST Studio a fost una dintre cele mai bune decizii pentru afacerea mea. Am apreciat enorm comunicarea impecabilă și atenția la detalii. Nu doar că au livrat site-ul într-un timp record, dar au înțeles perfect din prima ce imagine vreau să transmit. Design curat, funcționalitate ireproșabilă și un partener de încredere pe termen lung. Mulțumesc echipei!',
    rating: 5,
    source: 'google',
  },
  {
    author: 'Daniel',
    alt: 'Recenzie Google de la Daniel',
    altEn: 'Google review from Daniel',
    quote: 'Promptitudine si seriozitate. Recomand!',
    rating: 5,
    source: 'google',
  },
  {
    author: 'Preda',
    alt: 'Recenzie Google de la Preda',
    altEn: 'Google review from Preda',
    quote:
      'Experiență foarte bună! Echipa profesionistă, promptă, reacție bună la nevoia clientului, execuție rapidă după stabilirea soluției! Recomand cu tărie!',
    rating: 5,
    source: 'google',
  },
  {
    author: 'flavius',
    alt: 'Recenzie Google de la flavius',
    altEn: 'Google review from flavius',
    quote: 'seriorizitate, profesionalism, firma de încredere',
    rating: 5,
    source: 'google',
  },
  {
    author: 'Tekno',
    alt: 'Recenzie Google de la Tekno',
    altEn: 'Google review from Tekno',
    quote:
      'Am lucrat cu această firmă, pe tot parcursul colaborării au dat dovadă de profesionalism și seriozitate.',
    rating: 5,
    source: 'google',
  },
  {
    author: 'Florin',
    alt: 'Recenzie Google de la Florin',
    altEn: 'Google review from Florin',
    quote: 'Recomand cu incredere, site-ul a fost creat in 48 de ore. Multumesc',
    rating: 5,
    source: 'google',
  },
  {
    author: 'Hoca',
    alt: 'Recenzie Google de la Hoca',
    altEn: 'Google review from Hoca',
    quote: 'Recomand cu încredere tuturor antreprenorilor care vor să își dezvolte afacerea în mediul digital!',
    rating: 5,
    source: 'google',
  },
  {
    author: 'constantinescu',
    alt: 'Recenzie Google de la constantinescu',
    altEn: 'Google review from constantinescu',
    quote: 'Recomand cu drag, firma de incredere, personal calificat, adevarati profesionisti!!',
    rating: 5,
    source: 'google',
  },
]
