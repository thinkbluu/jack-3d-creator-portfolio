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

  const publishedAt = stringDate(data.publishedAt, 'publishedAt', fileName)
  const updatedAt = data.updatedAt ? stringDate(data.updatedAt, 'updatedAt', fileName) : undefined
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt) || (updatedAt && !/^\d{4}-\d{2}-\d{2}$/.test(updatedAt))) {
    throw new Error(`Dates must use the YYYY-MM-DD format in ${fileName}`)
  }
  if (updatedAt && updatedAt < publishedAt) {
    throw new Error(`Frontmatter field "updatedAt" (${updatedAt}) is earlier than "publishedAt" (${publishedAt}) in ${fileName}`)
  }

  return {
    slug,
    title: requiredString(data.title, 'title', fileName),
    excerpt: requiredString(data.excerpt, 'excerpt', fileName),
    category,
    categoryLabel: requiredString(data.categoryLabel, 'categoryLabel', fileName),
    readMin,
    publishedAt,
    updatedAt,
    answerCapsule: requiredString(data.answerCapsule, 'answerCapsule', fileName),
    seoTitle: optionalString(data.seoTitle, 'seoTitle', fileName),
    seoDescription: optionalString(data.seoDescription, 'seoDescription', fileName),
    faqItems: parseFaqItems(data.faqItems, fileName),
    howToSteps: parseHowToSteps(data.howToSteps, fileName),
  }
}

const normalizeText = (value: string) => value.replace(/[\s*_]+/g, ' ').replace(/[„”"]/g, '"').trim()

/**
 * The article template already renders the answer capsule ("Pe scurt") and the
 * FAQ block from frontmatter. Drop a body paragraph or section that repeats them,
 * so a page never shows the same text twice.
 */
function removeTemplateDuplicates(body: string, frontmatter: BlogFrontmatter) {
  let result = body.trim()

  const [firstBlock, ...rest] = result.split(/\n\s*\n/)
  if (firstBlock && normalizeText(firstBlock) === normalizeText(frontmatter.answerCapsule)) {
    result = rest.join('\n\n').trim()
  }

  if (frontmatter.faqItems?.length) {
    result = result.replace(/^## [^\n]*întrebările frecvente[^\n]*\n[\s\S]*?(?=^## |(?![\s\S]))/im, '').trim()
  }

  return result
}

function readPost(fileName: string): BlogPost {
  const filePath = path.join(blogDirectory, fileName)
  const file = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(file)
  const frontmatter = parseFrontmatter(data, fileName)

  return {
    ...frontmatter,
    body: removeTemplateDuplicates(content, frontmatter),
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

const STOPWORDS = new Set(
  'a ai al ale am ar are as asa au ca cat ce cel cea cei cele cand care cu cum da dar de din doar dupa e este fara fi ii il in inainte la le li lui mai mult nu o ori pe pentru sa sau se si sunt te tu un una unei unui va vs tau ta tale ti iti'.split(' '),
)

/** Every post appears in at least MIN and, while there is a choice, at most MAX "Citește și" lists. */
const MIN_TIMES_RECOMMENDED = 2
const MAX_TIMES_RECOMMENDED = 5

function topicTokens(post: BlogPost) {
  const text = `${post.slug.replace(/-/g, ' ')} ${post.title}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  return new Set(text.split(/[^a-z0-9]+/).filter((token) => token.length > 2 && !STOPWORDS.has(token)))
}

function linkedPaths(post: BlogPost) {
  return new Set(Array.from(post.body.matchAll(/\]\((\/(?:servicii|portofoliu|blog)\/[^)#\s]+)\)/g), (match) => match[1]))
}

/** Words or links that most posts share say little about the topic, so rarer ones weigh more. */
function rarityWeights(sets: Array<Set<string>>) {
  const counts = new Map<string, number>()
  for (const set of sets) for (const value of set) counts.set(value, (counts.get(value) ?? 0) + 1)
  return (value: string) => Math.log(sets.length / (counts.get(value) ?? sets.length))
}

/**
 * "Citește și" for every post at once. Pairs are taken from the closest topics
 * down (shared title words, then shared links, then category) in three passes:
 * the first gives every post its MIN_TIMES_RECOMMENDED spots, the second fills
 * the lists while no post goes past MAX_TIMES_RECOMMENDED, the last fills any
 * gaps. No guide is left without links from other guides, and none becomes a hub.
 */
function relatedPostsIndex(posts: BlogPost[], limit: number) {
  const tokens = new Map(posts.map((post) => [post.slug, topicTokens(post)]))
  const links = new Map(posts.map((post) => [post.slug, linkedPaths(post)]))
  const tokenWeight = rarityWeights([...tokens.values()])
  const linkWeight = rarityWeights([...links.values()])

  const score = (post: BlogPost, candidate: BlogPost) => {
    const postLinks = links.get(post.slug)!
    const candidateLinks = links.get(candidate.slug)!
    const sharedTokens = [...tokens.get(candidate.slug)!].filter((token) => tokens.get(post.slug)!.has(token))
    const sharedLinks = [...candidateLinks].filter((link) => postLinks.has(link))
    const linksEachOther = postLinks.has(`/blog/${candidate.slug}`) || candidateLinks.has(`/blog/${post.slug}`) ? 2 : 0
    const sameCategory = candidate.category === post.category ? 0.5 : 0
    return (
      sharedTokens.reduce((sum, token) => sum + 3 * tokenWeight(token), 0) +
      sharedLinks.reduce((sum, link) => sum + linkWeight(link), 0) +
      linksEachOther +
      sameCategory
    )
  }

  type Pair = { post: BlogPost; candidate: BlogPost; score: number }
  const closestFirst = (a: Pair, b: Pair) =>
    b.score - a.score ||
    b.candidate.publishedAt.localeCompare(a.candidate.publishedAt) ||
    a.candidate.slug.localeCompare(b.candidate.slug) ||
    a.post.slug.localeCompare(b.post.slug)

  const pairs: Pair[] = posts
    .flatMap((post) =>
      posts.filter((candidate) => candidate !== post).map((candidate) => ({ post, candidate, score: score(post, candidate) })),
    )
    .sort(closestFirst)

  const related = new Map(posts.map((post) => [post.slug, [] as Pair[]]))
  const timesRecommended = new Map<string, number>()
  for (const cap of [MIN_TIMES_RECOMMENDED, MAX_TIMES_RECOMMENDED, Infinity]) {
    for (const pair of pairs) {
      const list = related.get(pair.post.slug)!
      const times = timesRecommended.get(pair.candidate.slug) ?? 0
      if (list.length >= limit || list.includes(pair) || times >= cap) continue
      list.push(pair)
      timesRecommended.set(pair.candidate.slug, times + 1)
    }
  }
  return new Map([...related].map(([slug, list]) => [slug, list.sort(closestFirst).map((pair) => pair.candidate)]))
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return relatedPostsIndex(getAllPosts(), limit).get(post.slug) ?? []
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}
