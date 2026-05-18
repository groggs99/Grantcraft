# GrantCraft

GrantCraft helps Irish community and voluntary organisations find relevant grants and write stronger funding applications. The product is built for the volunteer secretary, the part-time community development worker, the GAA club treasurer — people who are short on time, unfamiliar with grant-writing conventions, and currently lose hours navigating funder portals. The interface aims to feel calm, trustworthy, and written in plain English.

## The four-stage journey

| Stage | Name | What it does |
|-------|------|--------------|
| 1 | Organisation Profile | Build a rich profile used as context for every later stage |
| 2 | Idea Development | Shape a funding need into a structured project brief |
| 3 | Grant Matching | Surface relevant grants from a curated Irish funding database |
| 4 | Application Generation | Draft a tailored application section by section |

Stage 1 is the foundation — every downstream feature depends on profile completeness.

## Stack

- Next.js 16 (App Router, Server Components by default)
- Tailwind CSS v4
- Supabase (Postgres + Auth + Row-Level Security) via `@supabase/ssr`
- TypeScript, strict mode, no `any`
- Deployed on Vercel

## Getting started

Prerequisites: Node.js (version pinned in `package.json`) and a Supabase project with the migrations below applied.

```bash
npm install
cp .env.local.example .env.local   # add your Supabase URL and anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database migrations

Apply in order against your Supabase project:

```
supabase/migrations/001_create_organisations.sql
supabase/migrations/002_create_project_ideas.sql
supabase/migrations/003_add_beta_profile_fields.sql
```

## Reference data

| File | Purpose |
|------|---------|
| `ireland_grants_database_v3.xlsx` | 96-grant Irish funding database used by Stage 3 matching |
| `grantcraft_tam_analysis.xlsx` | Total addressable market and SAM analysis |
| `grantcraft-platform-brief.md` | Product brief and platform overview |

## Working in this repo

GrantCraft is built collaboratively with three AI tools playing distinct, non-overlapping roles:

- **Claude (in chat)** — architect. Holds the roadmap and writes a spec for every chunk before any code is written. Specs live in `docs/specs/`.
- **Claude Code** — primary builder. Implements one chunk per branch, working from the spec.
- **Codex** — reviewer. Reviews each PR against the spec and the conventions in `AGENTS.md`. Never the primary author for the same surface Claude Code wrote, and vice versa.

Each unit of work is a single chunk on a single branch with a single focused PR. Session progress is logged in `BUILD_LOG.md`; the chunk backlog lives in `ROADMAP.md`. Read `AGENTS.md` and `CLAUDE.md` before starting any work — they document stack conventions, the calm-UI requirement, and Irish-specific rules that the agents must follow.

## Conventions

- All UI copy uses Irish English (organisation, programme, centre, recognise).
- County data refers to the 26 counties of the Republic of Ireland.
- Monetary amounts use the euro (€) symbol and Irish formatting (e.g. €5,000).
- Charity registration refers to the Charities Regulator; company numbers to the CRO.
- Org types align to common Irish legal structures: CLG, CIC, unincorporated voluntary, registered charity.

## Status

Pre-beta. The beta onboarding flow is in active development for co-designer testing with Irish community organisations. The full Stage 1 form, Supabase auth, and Stages 2–4 are upcoming.
