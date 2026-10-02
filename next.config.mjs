/** @type {import('next').NextConfig} */
const nextConfig = {
  // The contest's daily job lists the newest posts in the newsletter draft.
  outputFileTracingIncludes: {
    '/api/cron/site-gratuit': ['./content/blog/**/*'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  async redirects() {
    return [
      // Apps and SaaS platforms now have separate service pages.
      { source: '/servicii/aplicatii-si-platforme', destination: '/servicii/aplicatii-web', permanent: true },
      // Posts merged into stronger pages on the same topic (one URL per search intent).
      { source: '/blog/agentie-vs-freelancer-vs-studio', destination: '/comparatie', permanent: true },
      { source: '/blog/web-design-timisoara', destination: '/blog/cum-alegi-firma-web-design', permanent: true },
      { source: '/blog/lectii-veterinaria-timisoara', destination: '/portofoliu/veterinaria-timisoara', permanent: true },
      { source: '/blog/faq-mentenanta-site', destination: '/servicii/mentenanta', permanent: true },
      { source: '/blog/ce-include-pretul-unui-site', destination: '/blog/cat-costa-un-site-in-romania', permanent: true },
      { source: '/blog/livrare-site-48-ore', destination: '/blog/cat-dureaza-constructia-unui-site', permanent: true },
      { source: '/blog/avans-50-eur-cum-functioneaza', destination: '/blog/cat-dureaza-constructia-unui-site', permanent: true },
      { source: '/blog/creare-site-timisoara-checklist', destination: '/blog/cum-alegi-firma-web-design', permanent: true },
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
      "img-src 'self' data: blob: https://placehold.co https://*.google-analytics.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com",
      "font-src 'self' data:",
      "connect-src 'self' https://vitals.vercel-insights.com https://*.vercel-insights.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com",
      "upgrade-insecure-requests",
    ].join('; ')

    return [{
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: contentSecurityPolicy },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      ],
    }]
  },
}

export default nextConfig
