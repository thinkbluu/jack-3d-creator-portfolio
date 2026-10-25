import { ardCatalog } from '@/lib/agents'

// Prerendered at build time from the same data as the skill file.
export const dynamic = 'force-static'

export function GET() {
  return new Response(JSON.stringify(ardCatalog(), null, 2), {
    headers: {
      'Content-Type': 'application/ai-catalog+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
