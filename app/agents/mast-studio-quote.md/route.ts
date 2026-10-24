import { skillMarkdown } from '@/lib/agents'

// Prerendered at build time so the generated skill always matches the
// deployed service data.
export const dynamic = 'force-static'

export function GET() {
  return new Response(skillMarkdown(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
