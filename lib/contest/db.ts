import postgres from 'postgres'

// Postgres (Neon through the Vercel Marketplace). The tables are created on
// first use, so a new database needs no manual setup.

let client: postgres.Sql | null = null
let schemaReady: Promise<void> | null = null

export function sql() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not configured')
  // prepare: false keeps the connection pooler (PgBouncer) happy.
  client ??= postgres(url, { max: 1, prepare: false, idle_timeout: 20, connect_timeout: 10 })
  return client
}

const schema = [
  `create table if not exists contest_entrants (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    name text not null,
    phone text,
    business_name text not null,
    business_form text not null,
    activity text not null,
    city text not null,
    site_goal text,
    initial_post_url text,
    marketing_consent boolean not null default false,
    consent_version text not null,
    ip_hash text,
    created_at timestamptz not null default now(),
    confirmed_at timestamptz,
    withdrawn_at timestamptz
  )`,
  `create table if not exists contest_entries (
    id uuid primary key default gen_random_uuid(),
    entrant_id uuid not null references contest_entrants(id) on delete cascade,
    round text not null,
    post_url text,
    post_submitted_at timestamptz,
    likes integer,
    status text not null default 'active',
    reminded_at timestamptz,
    created_at timestamptz not null default now(),
    unique (entrant_id, round)
  )`,
  `create table if not exists contest_rounds (
    round text primary key,
    closed_at timestamptz,
    likes_recorded_at timestamptz,
    winner_entry_id uuid references contest_entries(id),
    claim_deadline timestamptz,
    claimed_at timestamptz,
    claim_brief jsonb,
    publish_consent boolean not null default false,
    delivered_at timestamptz,
    delivered_url text,
    newsletter_draft_at timestamptz,
    audit jsonb
  )`,
  'create index if not exists contest_entries_round_idx on contest_entries (round)',
]

export function ensureSchema() {
  schemaReady ??= (async () => {
    const db = sql()
    for (const statement of schema) await db.unsafe(statement)
  })().catch((error: unknown) => {
    schemaReady = null
    throw error
  })
  return schemaReady
}
