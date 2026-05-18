# GrantCraft

GrantCraft helps Irish community and voluntary organisations find relevant grants and draft stronger funding applications. It guides organisations through a four-stage journey from profiling to funded impact.

## The Four Stages

| Stage | Name | What it does |
|-------|------|--------------|
| 1 | Organisation Profile | Build a rich profile used across all other stages |
| 2 | Idea Development | Turn a plain-language project idea into a structured grant brief |
| 3 | Grant Matching | Surface relevant grants from the 96-grant Irish database |
| 4 | Application Generation | Draft and export grant applications section by section |

Stage 1 is the foundation — every downstream feature depends on profile completeness.

## Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Styling**: Tailwind CSS v4
- **Database / Auth**: Supabase (Postgres + Row-Level Security + Auth)
- **Language**: TypeScript strict mode

## Getting Started

### Prerequisites

- Node.js (see `package.json` for version)
- A Supabase project with the migrations in `supabase/migrations/` applied

### Setup

```bash
npm install
cp .env.local.example .env.local   # add your Supabase URL and anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database migrations

Apply migrations in order against your Supabase project:

```
supabase/migrations/001_create_organisations.sql
supabase/migrations/002_create_project_ideas.sql
supabase/migrations/003_add_beta_profile_fields.sql
```

## Reference data

| File | Purpose |
|------|---------|
| `ireland_grants_database_v3.xlsx` | Canonical 96-grant database used for Stage 2 matching |
| `grantcraft_tam_analysis.xlsx` | Total addressable market analysis |
| `grantcraft-platform-brief.md` | Product brief and platform overview |

## Conventions

- All copy uses Irish English (organisation, colour, programme, recognise)
- Counties refer to the 26 counties of the Republic of Ireland
- Monetary amounts use the euro (€) symbol
- Charity registration is with the Charities Regulator; company numbers reference the CRO
