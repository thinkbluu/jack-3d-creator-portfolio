export type BlogCategory = 'ghid' | 'comparatie' | 'sfat'

export type BlogFaqItem = {
  question: string
  answer: string
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: BlogCategory
  categoryLabel: string
  readMin: number
  publishedAt: string
  updatedAt?: string
  body: string
  seoTitle?: string
  seoDescription?: string
  faqItems?: BlogFaqItem[]
}

export const posts: BlogPost[] = []

export function getAllPosts() {
  return posts
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug)
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}
