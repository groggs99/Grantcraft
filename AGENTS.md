<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes -- APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# GrantCraft Agent Instructions

## Product Context

GrantCraft helps Irish community and voluntary organisations find relevant grants and draft stronger funding applications. The first beta is for co-design partners who may be non-technical, time-poor, and unfamiliar with grant-writing software.

The product should feel calm, trustworthy, and practical. Prioritise plain English, visible progress, forgiving forms, and screens that help users complete a real task without needing technical knowledge.

## How To Work In This Repo

- Read `docs/BETA_PRD.md` and `docs/GRANTCRAFT_BUILD_WORKFLOW.md` before starting product work.
- Keep changes small, focused, and directly tied to the user's task.
- Do not change unrelated files, reformat unrelated code, or run broad refactors unless explicitly requested.
- Explain the plan before editing when the user asks for implementation work.
- Summarise changed files, verification performed, and any limitations after editing.
- If backend wiring is unclear, use typed mock data first and clearly label it.
- Prefer existing project patterns over introducing new libraries or abstractions.
- Preserve user changes in the worktree. Never revert changes you did not make unless the user asks.

## Next.js Rules

- This project uses a Next.js version with local docs in `node_modules/next/dist/docs/`.
- Before writing Next.js code, read the relevant local docs for the feature being changed, such as routing, forms, server actions, data fetching, metadata, or testing.
- Use the App Router conventions already present in `src/app`.
- Keep server-only work in server components, route handlers, or server actions as appropriate.
- Keep client components small and mark them with `'use client'` only when interactivity requires it.

## TypeScript And Code Standards

- Use TypeScript for all new application code.
- Define clear types for form data, API payloads, mock records, and component props.
- Avoid `any` unless there is a documented reason.
- Keep components small and named by their product purpose.
- Prefer simple functions and readable state over clever abstractions.
- Validate user input at the UI boundary and again on the server before persistence.
- Use accessible labels, button text, error messages, and form semantics.
- Keep copy clear and direct for Irish community and voluntary organisations.

## UI Principles

- Build the actual workflow first, not a marketing page.
- Use calm, practical layouts with clear hierarchy, short sections, and obvious next steps.
- Make forms forgiving: helpful hints, required field markers, inline validation, and save-progress behaviour where useful.
- Avoid visual clutter, jargon, and decorative UI that makes tasks harder.
- Design for users on laptops and phones.
- Do not expose implementation details, AI prompt mechanics, or internal shortcuts in the UI.

## Testing Rules

- Add or update tests where they reduce real risk.
- For forms and validation, test required fields, invalid inputs, success paths, and disabled/loading states where practical.
- For API routes or server actions, test validation and unauthorised access where the test setup supports it.
- If automated tests are not present or cannot be run, state exactly what manual checks were performed.
- Always run `npm run lint` after code changes unless blocked, and report the result.

## Security And Data Rules

- Treat user, organisation, grant, and application data as sensitive.
- Never log personal data, organisation profile details, draft application answers, auth tokens, or Supabase secrets.
- Enforce user ownership for organisation data and application drafts before reading or writing records.
- Keep Supabase server client usage on the server.
- Do not expose service-role keys or privileged credentials to the browser.
- Validate and sanitise data before saving it.
- Do not send more organisation data to AI services than the feature requires.
- Make AI-generated content editable and clearly reviewable by the user before export or submission.

## Things Not To Do

- Do not change application code when the user asks for docs only.
- Do not add dependencies without explaining why they are needed.
- Do not invent backend tables or production workflows without checking migrations and existing code.
- Do not skip auth or ownership checks for convenience.
- Do not build large, multi-feature changes in one branch.
- Do not silently ignore failing checks.
- Do not use real partner data in mocks, tests, screenshots, or prompts.
