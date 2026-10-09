'use client'

import { useEffect } from 'react'
import { textLinkClass } from './form-styles'

const REVIEW_URL = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL

/**
 * EmbedSocial Google reviews widget. React does not run inline <script> tags,
 * so the loader is appended from an effect. Re-adding it on every mount makes
 * the widget render again after client-side navigation (e.g. /mockup → /).
 */
export default function GoogleReviews({ className = '' }: { className?: string }) {
  useEffect(() => {
    document.getElementById('EmbedSocialHashtagScript')?.remove()
    const script = document.createElement('script')
    script.id = 'EmbedSocialHashtagScript'
    script.src = 'https://embedsocial.com/cdn/ht.js'
    document.head.appendChild(script)
  }, [])

  return (
    <section aria-labelledby="google-reviews" className={className}>
      <div className="porthole p-6 md:p-10">
        <h2 id="google-reviews" className="type-h3 text-balance">
          Ce spun clienții noștri
        </h2>
        <p className="type-body mt-2">Recenzii reale de pe Google.</p>

        {/* Reserved height so the page does not jump while the widget loads. */}
        <div className="mt-8 min-h-[520px] md:min-h-[420px]">
          <div className="embedsocial-hashtag" data-ref="29424628dec99d349c656d7622c3e31b341a1864" data-lazyload="yes">
            <a
              className="feed-powered-by-es feed-powered-by-es-feed-img es-widget-branding"
              href="https://embedsocial.com/google-reviews-widget/"
              target="_blank"
              rel="noopener"
              title="Embed Google reviews"
            >
              <img src="https://embedsocial.com/cdn/icon/embedsocial-logo.webp" alt="EmbedSocial" />
              <div className="es-widget-branding-text">Embed Google reviews</div>
            </a>
          </div>
        </div>

        {REVIEW_URL ? (
          <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer" className={`${textLinkClass} mt-6 inline-block`}>
            Lasă și tu o recenzie
          </a>
        ) : null}
      </div>
    </section>
  )
}
