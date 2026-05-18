@AGENTS.md

# GrantCraft — Project Context

GrantCraft is a four-stage web application that helps Irish non-profit organisations find and win grants. It moves organisations through a structured journey from profiling to funded impact.

## Four-Stage Journey

| Stage | Name | Purpose |
|-------|------|---------|
| 1 | Organisation Profile | Build and maintain a rich org profile used across all other stages |
| 2 | Idea Development | Shape a funding need into a structured project brief |
| 3 | Grant Matching | Surface relevant grants from the 96-grant database (v3) based on org profile and project brief |
| 4 | Application Generation | Draft a tailored grant application section by section, ready to export |

Stage 1 is the foundation — every downstream feature depends on profile completeness.

## Stack

- **Framework**: Next.js 16 (App Router, Server Components by default)
- **Styling**: Tailwind CSS v4 — uses `@import "tailwindcss"`, no `tailwind.config.js`, custom utilities via `@utility` or `@layer components`
- **Database / Auth**: Supabase (Postgres + Row-Level Security + Auth)
- **Icons**: lucide-react v1
- **Language**: TypeScript strict mode
- **Colour palette**: emerald (primary actions), stone (neutrals), red (errors)

## Environment

- VS Code + Claude Code (CLI)
- Node.js via project `package.json`; use `npm run dev` to start the dev server
- No Tailwind config file — all theme customisation goes in `src/app/globals.css`

## Grant Database

The 96-grant database (v3) is the canonical list of Irish grant programmes used for matching in Stage 3. Each grant record includes: funder, programme name, eligible org types, county/national reach, activity areas, typical award size, and deadline cadence.

## Key Conventions

- All copy uses **Irish English** (organisation, colour, programme, recognise, etc.)
- County names always refer to the 26 counties of the Republic of Ireland
- Monetary amounts use the **euro** (€) symbol
- Charity registration is with the Charities Regulator (not HMRC/Companies House UK)
- Company numbers reference the Companies Registration Office (CRO)

## File Layout

```
src/
  app/
    globals.css                          # Tailwind import + global custom classes
    layout.tsx
    page.tsx                             # Landing page
    favicon.ico
    api/
      ai/
        generate-brief/route.ts          # Stage 2 — AI brief generation endpoint
    auth/
      actions.ts                         # Auth server actions
      callback/route.ts                  # Supabase auth callback handler
      page.tsx                           # Sign-in / sign-up page
    org/
      new/page.tsx                       # Stage 1 — create org profile
      [id]/
        page.tsx                         # Stage 1 — view / edit org profile
        ideas/
          new/page.tsx                   # Stage 2 — create project idea brief
  components/
    org/
      OrgProfileForm.tsx                 # Multi-step profile form (client component)
    ideas/
      IdeaBriefForm.tsx                  # Project idea brief form (client component)
  lib/
    constants.ts                         # Irish-specific constants (counties, activity areas, etc.)
    supabase/
      client.ts                          # Supabase browser client
      server.ts                          # Supabase server client
  types/
    org.ts                               # Organisation TypeScript types
    ideas.ts                             # Project idea TypeScript types
  proxy.ts                               # Next.js proxy / middleware

supabase/
  migrations/
    001_create_organisations.sql
    002_create_project_ideas.sql
    003_add_beta_profile_fields.sql

docs/
  BETA_PRD.md                            # Beta product requirements
  GRANTCRAFT_BUILD_WORKFLOW.md           # AI build workflow documentation
```
