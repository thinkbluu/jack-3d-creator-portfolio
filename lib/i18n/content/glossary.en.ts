import type { GlossaryCategory } from '@/lib/glossary'

export const glossaryCategoryLabelsEn: Record<GlossaryCategory, string> = {
  tehnic: 'Technical',
  design: 'Design',
  marketing: 'Marketing',
  legal: 'Legal',
}

export const glossaryTextEn: Record<string, { term: string; definition: string; extra?: string }> = {
  pagespeed: {
    term: 'PageSpeed',
    definition:
      'PageSpeed is the score Google gives a website based on how fast it loads and how quickly it becomes usable. It is measured from 0 to 100, separately for mobile and desktop. A score under 50 on mobile means the site loses visitors and drops in search results.',
    extra: 'You can check it for free with Google’s PageSpeed Insights tool.',
  },
  domeniu: {
    term: 'Domain',
    definition:
      'The domain is your website’s address on the internet, for example firmata.ro. It is bought for a year or more, costs between 10 and 40 EUR a year for a .ro extension, and should be registered in your company’s name, not in the name of the supplier who builds the site.',
  },
  hosting: {
    term: 'Hosting',
    definition:
      'Hosting is the service that keeps your website reachable on the internet, 24 hours a day. It costs between 40 and 100 EUR a year for a presentation website. Without hosting, the site exists only on the computer of the person who built it.',
  },
  responsive: {
    term: 'Responsive',
    definition:
      'Responsive means a website automatically adapts its layout to the size of the screen, from a phone to a large monitor. Without responsive design, the text is tiny on a phone and you have to zoom, and Google penalises sites like that in mobile search results.',
  },
  cms: {
    term: 'CMS',
    definition:
      'A CMS (content management system) lets you change the text and photos on a website yourself, without knowing how to write code. WordPress is the most widely used CMS in the world, but there are also custom-built alternatives for specific needs.',
  },
  wordpress: {
    term: 'WordPress',
    definition:
      'WordPress is the most widely used website management system in the world, used by about 40% of all websites on the internet. It is flexible and cheap to start, but it needs regular maintenance (updates, security) to stay safe and fast.',
  },
  ssl: {
    term: 'SSL',
    definition:
      'SSL is the certificate that encrypts the data sent between a visitor and your website, visible as the padlock in the address bar and an address that starts with https. Without it, browsers mark the site as “not secure”, and Google penalises it in the rankings.',
  },
  seo: {
    term: 'SEO',
    definition:
      'SEO (search engine optimisation) is the set of techniques by which a website appears higher in Google results for relevant searches, without paying for ads. It includes site speed, the structure of the text, keywords, and links received from other websites.',
  },
  'seo-local': {
    term: 'Local SEO',
    definition:
      'Local SEO is the optimisation of a website and a business profile so it appears in searches with a geographic intent, for example “plumber Timișoara”. It relies on Google Business Profile, reviews, an address that is consistent online, and local mentions.',
  },
  'google-business-profile': {
    term: 'Google Business Profile',
    definition:
      'Google Business Profile is your business’s free profile, which appears on Google Maps and in the panel on the right of Google searches, with hours, address, reviews, and photos. It is essential for any business with a physical location or a local service area.',
  },
  'landing-page': {
    term: 'Landing page',
    definition:
      'A landing page is a single page dedicated to one goal, usually used for an advertising campaign or a product launch. It has one action button and avoids links that distract the visitor from converting.',
  },
  conversie: {
    term: 'Conversion',
    definition:
      'A conversion is the moment a visitor does the action you are aiming for: sends a message, fills in a form, or buys a product. The number of conversions, not the number of visits, shows whether a website is doing its job.',
  },
  'rata-de-conversie': {
    term: 'Conversion rate',
    definition:
      'The conversion rate is the percentage of visitors who take the desired action, calculated as the number of conversions divided by the total number of visitors. A rate of 2–3% is typical for a presentation website; above 5% is considered very good.',
  },
  cta: {
    term: 'CTA',
    definition:
      'A CTA (call to action) is the button or the text that tells the visitor exactly what to do next, for example “Request a quote” or “Write to us on WhatsApp”. A website without a clear CTA lets the visitor leave without acting, however good the content is.',
  },
  mockup: {
    term: 'Mockup',
    definition:
      'A mockup is a static visual representation of a website or an app screen, showing exactly how it will look at the end: colours, fonts, real images. It differs from a wireframe in that it is fully styled, not just a diagram.',
  },
  wireframe: {
    term: 'Wireframe',
    definition:
      'A wireframe is a simple sketch, without colours or final styling, that shows only the structure and the position of the elements on a page: where the title is, where the button is, where the image is. It is used at the start of a project, before the final design.',
  },
  'front-end': {
    term: 'Front end',
    definition:
      'The front end is the part of a website or app that the visitor sees and uses directly: layout, colours, buttons, animation. It is built with technologies such as HTML, CSS, and JavaScript, and it runs in the user’s browser.',
  },
  'back-end': {
    term: 'Back end',
    definition:
      'The back end is the invisible part of an application that manages the data, the business logic, and the security — for example processing an order or saving a user account. It runs on a server, not in the visitor’s browser.',
  },
  api: {
    term: 'API',
    definition:
      'An API (application programming interface) is the standardised way two programs talk to each other, for example your website and the invoicing system or the courier system. Without APIs, every integration would have to be built by hand, from scratch.',
  },
  'e-factura': {
    term: 'e-Factura',
    definition:
      'e-Factura is Romania’s mandatory national system through which companies send invoices electronically to ANAF, in a standardised format. An online store or an invoicing platform has to be connected to this system in order to issue valid invoices.',
  },
  gdpr: {
    term: 'GDPR',
    definition:
      'GDPR is the European regulation that requires any website collecting personal data (name, email, phone) to protect it, to explain clearly how it is used, and to allow it to be deleted on request. It applies to any website with a contact form or a user account.',
  },
  'cookie-banner': {
    term: 'Cookie banner',
    definition:
      'The cookie banner is the banner that appears on a first visit and asks the visitor’s consent for analytics or marketing cookies. It is required by law if the site uses such cookies, and refusing must be as simple as accepting.',
  },
  backlink: {
    term: 'Backlink',
    definition:
      'A backlink is a link from another website that points to yours. Google treats them as “votes of confidence”: the more quality backlinks you receive, the better the chance of appearing higher in search results.',
  },
  'meta-description': {
    term: 'Meta description',
    definition:
      'The meta description is the short text that appears under a website’s title in Google results, meant to convince the user to click. It does not directly influence the ranking, but a weak description lowers the click rate even if the site appears in first position.',
  },
  sitemap: {
    term: 'Sitemap',
    definition:
      'A sitemap is a file that lists all the important pages of a website, used by Google to discover and index them faster and more completely. It is different from the navigation menu: it is meant for search engines, not for visitors.',
  },
  favicon: {
    term: 'Favicon',
    definition:
      'The favicon is the small icon of a website that appears in the browser tab, in bookmarks, and in mobile search results. A site without a favicon looks unfinished and is harder to pick out among several open tabs.',
  },
}
