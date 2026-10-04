import type { Project } from '@/lib/projects'

type ProjectText = Pick<
  Project,
  'metaDescription' | 'client' | 'categoryLabel' | 'summary' | 'challenge' | 'solution' | 'result' | 'conceptNote' | 'stack'
>

export const projectTextEn: Record<string, ProjectText> = {
  'veterinaria-timisoara': {
    metaDescription:
      'Case study: a mobile-first presentation website for a veterinary practice in Timișoara. The practice reported 80% more new clients after launch.',
    client: 'Veterinary practice',
    categoryLabel: 'Presentation website',
    summary: '80% more new clients in the first months after launch.',
    challenge:
      'The practice had run for years on referrals and walk-ins alone, with no online presence. Potential clients searching for “veterinar Timișoara” on their phone could not find it, and people who had heard of it had nowhere to check the hours, the address, or the services before they called.',
    solution:
      'We built the whole website around the three things a pet owner looks for in a crisis: which services are offered, where the practice is, and how to reach a vet quickly. The hours, the round-the-clock emergencies, and the location are visible on the first screen, and the booking button and the direct-call button stay present the whole length of the page. Everything is mobile-first, because most searches of this kind happen on a phone, often in an emergency.',
    result:
      'A few months after launch, the practice reported an increase of about 80% in the number of new clients, most of them arriving through local searches on Google.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Local SEO'],
  },
  'agd-innerpath-consulting': {
    metaDescription:
      'Case study: a bilingual Romanian–English website for a legal and strategic consultancy that advises executives, institutions, and public authorities.',
    client: 'Legal and strategic consultancy',
    categoryLabel: 'Presentation website',
    summary: 'A bilingual website for a firm that advises institutions and executives.',
    challenge:
      'The firm advises executives, institutions, and public authorities in emerging and established markets. It needed a website that would convey authority and discretion at the same time, without looking like a marketing agency, and that would work in two languages for international clients.',
    solution:
      'We built the website from scratch, with a restrained visual direction: deep navy, gold accents, serif type for the headings, and a portrait photograph as an anchor of trust. The structure follows the logic of a business conversation: who we are, what values guide us, which fields we work in, who the team is. The key figures — years of experience, completed contracts, markets covered — appear immediately under the title, as proof before the argument. The whole site works identically in Romanian and English.',
    result: 'The firm has a digital presence that supports a high-level consultancy positioning, in both working languages.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Bilingual RO/EN'],
  },
  decodex: {
    metaDescription:
      'Case study: an institutional website for a project co-financed through PoCIDIF 2021–2027, with the mandatory visibility elements and scientific content.',
    client: 'Project co-financed through PoCIDIF 2021–2027',
    categoryLabel: 'Institutional website',
    summary: 'A European project with strict compliance requirements, delivered in full.',
    challenge:
      'Projects financed by European funds have strict visibility requirements: mandatory visual-identity elements, an SMIS code, a contract number, and sections for results, the team, partners, and news. At the same time, the site had to explain a complex scientific subject clearly, for a mixed audience of researchers, institutional partners, and the funder’s evaluators.',
    solution:
      'We built the whole website, from the information architecture to the implementation. The top bar permanently carries the mandatory funding identifiers required by the PoCIDIF visibility rules. The scientific content is organised into sections that can be read on their own, each in language suited to its audience. The visual direction — cellular imagery and magenta accents on a dark ground — conveys advanced research without becoming arid. We also handled the IT component of the project, from the technical specifications to delivery and maintenance.',
    result:
      'The website works as the project’s official point of communication, both for the funder’s evaluators and for the scientific community and the institutional partners.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'PoCIDIF compliance'],
  },
  oncogen: {
    metaDescription:
      'Case study: an institutional website for a centre of excellence in oncology research in Timișoara, with a clear content architecture for each audience.',
    client: 'Research centre of excellence',
    categoryLabel: 'Institutional website',
    summary: 'An institutional website for a centre of excellence in oncology and regenerative-medicine research in Timișoara.',
    challenge:
      'A centre with intense research, international publications, and a place in European consortia, but with an online presence that did not reflect the scale of the work. The main challenge: to organise a large volume of scientific content — projects, collaborations, news — so that each audience, from researchers to partners and the press, finds what it is looking for quickly.',
    solution:
      'We designed and built the website from scratch. The information architecture has several entrances — research, projects, collaborations, a biotechnology hub, news — so each audience reaches what it needs in two clicks. The news bar at the top keeps the site alive and signals the centre’s current activity. Accreditations and certifications are reachable from the first screen, because they are the main argument in the relationship with institutional partners and European consortia.',
    result: 'The centre now has a digital presence equal to its research activity, used actively in its relationship with international partners.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Content architecture'],
  },
  'painea-casei': {
    metaDescription:
      'Case study: a presentation website for the official DADEX distributor in Romania, built around catalogue requests for bakery equipment.',
    client: 'Official DADEX distributor in Romania',
    categoryLabel: 'Presentation website',
    summary: 'A presentation website for the official distributor of an international bakery-equipment manufacturer.',
    challenge:
      'The client sells professional equipment for bakeries and pastry shops, products with a high price and a long decision cycle. The buyers, bakery owners, do not order online: they ask for a catalogue, specifications, and a conversation. The website had to earn trust in an international brand and generate catalogue requests, not direct sales.',
    solution:
      'We built the page around a single conversion goal: downloading the catalogue. The figures that matter to a buyer in the industry — the number of ovens produced, the manufacturer’s years of experience, how long the distribution has run in Romania — appear immediately under the title as proof of solidity. The product catalogue is structured by category, with clear specifications, and direct contact is present in the top bar the whole length of the site.',
    result:
      'The distributor now has its own channel through which buyers reach the catalogue and the contact details directly, without depending only on relationships and referrals.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Product catalogue'],
  },
  asesor: {
    metaDescription:
      'ASESOR, the SaaS platform MAST Studio is building for salons: bookings, client records, team, stock, and revenue in one place. In progress.',
    client: 'MAST Studio’s own product',
    categoryLabel: 'SaaS platform',
    summary: 'A management platform for salons: bookings, clients, team, stock, and revenue, in one place.',
    challenge:
      'Small salons manage bookings on paper or on a phone, and stock and revenue in notebooks or separate files. The result: missed appointments, products that run out without anyone noticing, and no view of the real profit. The tools already on the market are either too expensive or built for large chains.',
    solution:
      'We are building a platform that centralises exactly what a small or mid-sized salon needs, without useless features: a booking calendar, client records with history, team management, stock tracking, and revenue reporting. The interface is designed to be used from a phone, between two clients, not from a desk.',
    stack: ['Next.js', 'React', 'PostgreSQL', 'Tailwind CSS'],
  },
  lumora: {
    metaDescription:
      'Lumora, a MAST Studio design concept: a landing page for a digital wellness product, built as an exercise in atmosphere and large type.',
    client: 'Design concept',
    categoryLabel: 'Design concept',
    summary: 'A landing page for a digital wellness product, built as an exercise in atmosphere and typography.',
    challenge:
      'A product that sells calm needs a page that also conveys it, not one that only describes it. The challenge: to build a feeling of calm without losing commercial clarity, in a category where most websites look identical.',
    solution:
      'We built the page around a single full-scale atmospheric image, with large, open type laid over it. The sign-up form sits directly in the hero, with a single field, and the mood variants change from four options without reloading the page. Everything stays readable over the background thanks to a calculated contrast layer, not an opaque panel.',
    conceptNote: 'A demonstration concept, not a real product. Built to test how large type reads over a full-scale image.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion'],
  },
  mostar: {
    metaDescription:
      'Mostar, a MAST Studio design concept: a tourism destination page, built as an exercise in visual narrative controlled by scrolling.',
    client: 'Design concept',
    categoryLabel: 'Design concept',
    summary: 'A tourism destination page, built as an exercise in visual narrative on scroll.',
    challenge:
      'A destination is sold through images, but images alone do not build a story. The challenge: to use scrolling as a directing tool, so the visitor travels through the place, not just through a gallery.',
    solution:
      'We built a sequence in which the image layers move independently as you scroll, creating real depth instead of decorative parallax. The content appears in the rhythm of the movement, and moving between sections keeps the visual continuity. The page works in two languages, with an instant switch.',
    conceptNote: 'A demonstration concept, not an official page. Built to test a visual narrative controlled by scrolling.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Scroll-driven animation'],
  },
  lithos: {
    metaDescription:
      'Lithos, a MAST Studio design concept: an educational geology platform, built as an exercise in cursor interaction and visual depth.',
    client: 'Design concept',
    categoryLabel: 'Design concept',
    summary: 'An educational geology platform, built as an exercise in interaction and visual depth.',
    challenge:
      'Scientific content needs an interface that invites exploration, not passive reading. The challenge: to build a page that conveys scale and depth, without sacrificing performance.',
    solution:
      'We built a hero with a cursor-controlled reveal, in which a second image is uncovered through a circular mask that follows the movement, with smoothing so it does not feel jerky. Navigation is concentrated in a single central pill, and the whole interaction switches off cleanly on devices without a cursor.',
    conceptNote: 'A demonstration concept, not a real platform. Built to test cursor-based interactions and a mask.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Canvas API'],
  },
}
