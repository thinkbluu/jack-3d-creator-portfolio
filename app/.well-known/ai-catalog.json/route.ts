import { ardCatalog } from '@/lib/agents'

// Identical catalog served under the legacy name.
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
