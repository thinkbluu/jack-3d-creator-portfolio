import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export type BlogCategory = 'ghid' | 'comparatie' | 'sfat'

export type BlogFaqItem = {
  question: string
  answer: string
}

export type HowToStep = {
  name: string
  text: string
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
  answerCapsule: string
  seoTitle?: string
  seoDescription?: string
  faqItems?: BlogFaqItem[]
  howToSteps?: HowToStep[]
}

type BlogFrontmatter = Omit<BlogPost, 'body'>

const blogDirectory = path.join(process.cwd(), 'content', 'blog')
const validCategories = new Set<BlogCategory>(['ghid', 'comparatie', 'sfat'])

function requiredString(value: unknown, field: string, fileName: string) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Frontmatter field "${field}" is required in ${fileName}`)
  }
  return value.trim()
}

function optionalString(value: unknown, field: string, fileName: string) {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value !== 'string') {
    throw new Error(`Frontmatter field "${field}" must be a string in ${fileName}`)
  }
  return value.trim()
}

function stringDate(value: unknown, field: string, fileName: string) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return requiredString(value, field, fileName)
}

function parseFaqItems(value: unknown, fileName: string): BlogFaqItem[] | undefined {
  if (value === undefined || value === null) return undefined
  if (!Array.isArray(value)) throw new Error(`Frontmatter field "faqItems" must be an array in ${fileName}`)

  return value.map((item, index) => {
    if (!item || typeof item !== 'object') throw new Error(`faqItems[${index}] must be an object in ${fileName}`)
    const entry = item as Record<string, unknown>
    return {
      question: requiredString(entry.question, `faqItems[${index}].question`, fileName),
      answer: requiredString(entry.answer, `faqItems[${index}].answer`, fileName),
    }
  })
}

function parseHowToSteps(value: unknown, fileName: string): HowToStep[] | undefined {
  if (value === undefined || value === null) return undefined
  if (!Array.isArray(value)) throw new Error(`Frontmatter field "howToSteps" must be an array in ${fileName}`)

  return value.map((item, index) => {
    if (!item || typeof item !== 'object') throw new Error(`howToSteps[${index}] must be an object in ${fileName}`)
    const entry = item as Record<string, unknown>
    return {
      name: requiredString(entry.name, `howToSteps[${index}].name`, fileName),
      text: requiredString(entry.text, `howToSteps[${index}].text`, fileName),
    }
  })
}

function parseFrontmatter(data: Record<string, unknown>, fileName: string): BlogFrontmatter {
  const fileSlug = fileName.replace(/\.mdx$/, '')
  const slug = requiredString(data.slug ?? fileSlug, 'slug', fileName)
  if (slug !== fileSlug) {
    throw new Error(`Frontmatter slug "${slug}" must match filename "${fileSlug}.mdx"`)
  }

  const category = requiredString(data.category, 'category', fileName) as BlogCategory
  if (!validCategories.has(category)) {
    throw new Error(`Frontmatter field "category" must be ghid, comparatie or sfat in ${fileName}`)
  }

  const readMin = Number(data.readMin)
  if (!Number.isInteger(readMin) || readMin <= 0) {
    throw new Error(`Frontmatter field "readMin" must be a positive integer in ${fileName}`)
  }

  return {
    slug,
    title: requiredString(data.title, 'title', fileName),
    excerpt: requiredString(data.excerpt, 'excerpt', fileName),
    category,
    categoryLabel: requiredString(data.categoryLabel, 'categoryLabel', fileName),
    readMin,
    publishedAt: stringDate(data.publishedAt, 'publishedAt', fileName),
    updatedAt: data.updatedAt ? stringDate(data.updatedAt, 'updatedAt', fileName) : undefined,
    answerCapsule: requiredString(data.answerCapsule, 'answerCapsule', fileName),
    seoTitle: optionalString(data.seoTitle, 'seoTitle', fileName),
    seoDescription: optionalString(data.seoDescription, 'seoDescription', fileName),
    faqItems: parseFaqItems(data.faqItems, fileName),
    howToSteps: parseHowToSteps(data.howToSteps, fileName),
  }
}

function readPost(fileName: string): BlogPost {
  const filePath = path.join(blogDirectory, fileName)
  const file = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(file)

  return {
    ...parseFrontmatter(data, fileName),
    body: content.trim(),
  }
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(blogDirectory)) return []

  return fs
    .readdirSync(blogDirectory)
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map(readPost)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const safeSlug = path.basename(slug)
  if (safeSlug !== slug) return undefined

  const fileName = `${safeSlug}.mdx`
  const filePath = path.join(blogDirectory, fileName)
  if (!fs.existsSync(filePath)) return undefined

  return readPost(fileName)
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}
