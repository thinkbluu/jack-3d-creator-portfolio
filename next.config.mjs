/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exposes the deployment environment (production/preview) to client code so
  // Google Ads tracking only loads on production deployments.
  env: {
    NEXT_PUBLIC_TRACKING_ENV: process.env.VERCEL_ENV ?? '',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  async rewrites() {
    return {
      // robots.txt is served by a route handler (app/robots-txt) so the
      // Agentmap line can be emitted; the metadata robots convention cannot.
      beforeFiles: [{ source: '/robots.txt', destination: '/robots-txt' }],
      afterFiles: [],
      fallback: [],
    }
  },
  async redirects() {
    return [
      // Apps and SaaS platforms now have separate service pages.
      { source: '/servicii/aplicatii-si-platforme', destination: '/servicii/aplicatii-web', permanent: true },
      // Short vanity paths for the UX/UI design service.
      { source: '/ux-ui', destination: '/servicii/design-ux-ui', permanent: true },
      { source: '/design-ux', destination: '/servicii/design-ux-ui', permanent: true },
      { source: '/ui-ux', destination: '/servicii/design-ux-ui', permanent: true },
      { source: '/design', destination: '/servicii/design-ux-ui', permanent: true },
      { source: '/en/ux-design', destination: '/en/services/ux-ui-design', permanent: true },
      { source: '/en/ui-ux', destination: '/en/services/ux-ui-design', permanent: true },
      // Short vanity paths for the pricing page.
      { source: '/pret', destination: '/preturi', permanent: true },
      { source: '/tarife', destination: '/preturi', permanent: true },
      // Posts merged into stronger pages on the same topic (one URL per search intent).
      { source: '/blog/agentie-vs-freelancer-vs-studio', destination: '/comparatie', permanent: true },
      { source: '/blog/web-design-timisoara', destination: '/blog/cum-alegi-firma-web-design', permanent: true },
      { source: '/blog/lectii-veterinaria-timisoara', destination: '/portofoliu/veterinaria-timisoara', permanent: true },
      { source: '/blog/faq-mentenanta-site', destination: '/servicii/mentenanta', permanent: true },
      { source: '/blog/ce-include-pretul-unui-site', destination: '/blog/cat-costa-un-site-in-romania', permanent: true },
      { source: '/blog/livrare-site-48-ore', destination: '/blog/cat-dureaza-constructia-unui-site', permanent: true },
      { source: '/blog/avans-50-eur-cum-functioneaza', destination: '/blog/cat-dureaza-constructia-unui-site', permanent: true },
      { source: '/blog/creare-site-timisoara-checklist', destination: '/blog/cum-alegi-firma-web-design', permanent: true },
      // Romanian stays unprefixed. /ro is not a public locale prefix.
      { source: '/ro', destination: '/', permanent: true },
      { source: '/ro/:path*', destination: '/:path*', permanent: true },
    ]
  },
  async headers() {
    // Google Tag (GA4) is allowed explicitly; it stays in Consent Mode until the
    // visitor accepts the banner.
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com https://*.googletagmanager.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://placehold.co https://*.google-analytics.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com https://*.googleusercontent.com",
      "font-src 'self' data:",
      "connect-src 'self' https://vitals.vercel-insights.com https://*.vercel-insights.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com",
      "upgrade-insecure-requests",
    ].join('; ')

    return [
      {
        // AI Catalog discovery: the homepage advertises the manifest via an
        // HTTP Link header (in addition to the <link rel="ai-catalog"> tag).
        source: '/',
        headers: [{ key: 'Link', value: '</.well-known/ai-catalog.json>; rel="ai-catalog"' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
}

export default nextConfig
