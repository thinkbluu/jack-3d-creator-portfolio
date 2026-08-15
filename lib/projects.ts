export type ProjectCategory = 'site-prezentare' | 'magazin-online' | 'aplicatie' | 'platforma' | 'branding'

export type ProjectTestimonial = {
  quote: string
  author: string
  role: string
}

export type Project = {
  slug: string
  name: string
  client: string
  category: ProjectCategory
  categoryLabel: string
  year: number
  summary: string
  challenge: string
  solution: string
  result?: string
  stack: string[]
  liveUrl?: string
  cover: string
  gallery?: string[]
  testimonial?: ProjectTestimonial
  featured: boolean
}

export const projects: Project[] = [
  {
    slug: 'instal-total',
    name: 'Instal Total',
    client: 'Instal Total SRL',
    category: 'site-prezentare',
    categoryLabel: 'Site de prezentare',
    year: 2026,
    summary: 'Un site de prezentare pentru o firmă de instalații, construit ca să aducă cereri de ofertă, nu doar vizite.',
    challenge:
      'Instal Total lucra doar din recomandări și nu avea nicio prezență online. Clienții noi nu găseau firma pe Google, iar singurul punct de contact era un număr de telefon afișat pe o furgonetă.',
    solution:
      'Am construit un site de o singură pagină, cu accent pe servicii, zone deservite și un buton de contact pe WhatsApp vizibil în orice moment. Textele au fost scrise de noi pe baza unui apel de 20 de minute cu proprietarul, iar site-ul a fost livrat în 48 de ore.',
    stack: ['Next.js', 'Tailwind CSS', 'Vercel'],
    liveUrl: 'https://maststudio.ro',
    cover: '/images/after-instal.webp',
    testimonial: {
      quote: 'Am primit primele cereri prin WhatsApp în aceeași săptămână în care site-ul a fost publicat.',
      author: 'Andrei M.',
      role: 'Proprietar, Instal Total SRL',
    },
    featured: true,
  },
]

export function getAllProjects() {
  return projects
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export function getFeaturedProjects(limit: number) {
  return projects.filter((project) => project.featured).slice(0, limit)
}
