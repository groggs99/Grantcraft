# GrantCraft Build Workflow

This workflow is for a non-developer founder using Codex and AI coding tools to build GrantCraft in small, safer steps.

## 1. Start With One Clear Outcome

Each branch should have one product outcome, such as:

- `Build organisation profile flow`
- `Add grant match results page`
- `Create draft answer workspace`
- `Improve export to document`

Avoid combining product work, refactoring, styling cleanup, and backend changes in one branch.

## 2. Branch Naming

Use short, descriptive branch names:

- `feature/org-profile-flow`
- `feature/grant-matching-results`
- `feature/application-draft-workspace`
- `fix/org-profile-validation`
- `docs/beta-prd-workflow`
- `refactor/profile-form-components`

Use `feature/` for new user-facing work, `fix/` for bugs, `docs/` for documentation-only work, and `refactor/` for cleanup that should not change behaviour.

## 3. Task Prompt Template

Give Codex a focused task with context, requirements, and boundaries:

```text
Read AGENTS.md, docs/BETA_PRD.md, and docs/GRANTCRAFT_BUILD_WORKFLOW.md.

Task:
Build [specific user-facing outcome].

Requirements:
- [Required fields or behaviours]
- Use a simple, calm UI for Irish community organisations.
- Use TypeScript for new code.
- Keep components small.
- Add validation where appropriate.
- Use mock data first if backend wiring is unclear.
- Do not change unrelated files.
- Add or update tests where useful.

Before editing, explain your plan.
After editing, summarise changed files and how I should test it.
```

## 4. UI-First Development

For new product areas, build the user journey first with mock data. This lets you review the workflow before committing to backend structure.

Recommended order:

1. Create the page and small components.
2. Add typed mock data.
3. Add form validation and empty/loading/error states.
4. Review the UI manually on desktop and mobile.
5. Wire to Supabase only after the flow feels right.

## 5. Mock Data Rules

Mock data should be realistic but fictional. Use Irish community and voluntary organisation examples without copying real partner details.

Good mock examples:

- A community centre in Mayo
- A youth arts group in Cork
- A disability inclusion project in Dublin
- A tidy towns group in Leitrim

Never use real user records, private partner notes, real application drafts, or real funder correspondence as mock data.

## 6. Validation And Safety Checks

For every user-input feature, ask Codex to cover:

- Required fields
- Invalid formats, such as bad email addresses or URLs
- Helpful error messages
- Loading and disabled states during save
- What happens when the user is not signed in
- Whether the user owns the organisation or draft being accessed

## 7. Tests

Use tests where they provide confidence, especially around validation, data mapping, permissions, and important UI states.

Minimum expectation for code branches:

- Run `npm run lint`
- Add targeted tests if the project has a suitable test setup
- If no test setup exists, ask Codex to document manual checks clearly

Do not spend a whole branch building a large test framework unless that is the explicit task.

## 8. Pull Request Review

Before merging a branch, ask Codex for a review:

```text
Review this branch as a senior engineer.
Focus on bugs, security issues, data ownership, missing validation, accessibility, and missing tests.
Do not rewrite code unless I ask.
```

Check that the PR summary explains:

- What changed
- How it was tested
- Any known limitations
- Any follow-up work

## 9. Security Review

Run a security review before features involving auth, organisation data, grants, application drafts, AI calls, export, or file handling.

Ask:

```text
Review this branch for security and privacy risks.
Focus on Supabase auth, organisation ownership, exposed secrets, logs, AI data sharing, and user-generated content.
```

Do not merge if user data can be read or written without an ownership check.

## 10. Preview Deployment

For user-facing features, use a preview deployment before merging if available.

Review:

- Does the page load without errors?
- Is the flow understandable without explanation?
- Does it work on mobile?
- Are empty states and validation messages helpful?
- Is the UI calm and suitable for non-technical organisations?
- Are AI outputs editable before save or export?

## 11. Refactoring Days

Schedule refactoring separately from feature branches. Good refactoring tasks include:

- Split a large form into smaller components
- Move repeated labels or option lists into typed constants
- Simplify validation helpers
- Remove unused mock data
- Improve naming after a feature has stabilised

Refactoring branches should not change product behaviour unless the task explicitly says so.

## 12. Suggested Beta Build Order

1. Documentation and workflow guardrails
2. Signup and login
3. Organisation profile
4. Grant matching with mock grants
5. Grant detail page
6. Application draft workspace
7. AI-assisted answer drafting
8. Save and export
9. Feedback capture
10. Backend hardening and security review
