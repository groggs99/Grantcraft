# GrantCraft Beta PRD

## Product Summary

GrantCraft helps Irish community and voluntary organisations find relevant grants and draft stronger applications. The beta is for co-design partners who will help validate the core workflow before a wider launch.

The beta should focus on one golden journey: a user signs in, creates an organisation profile, sees relevant grants, opens a grant detail page, drafts application answers with AI support, saves or exports the draft, and gives feedback.

## Target Users

Primary users:

- Staff, volunteers, trustees, and committee members in Irish community and voluntary organisations
- Small organisations with limited grant-writing capacity
- Groups working locally or county-wide across areas such as youth, older people, disability, environment, arts, sport, social inclusion, rural development, and community facilities

Common constraints:

- Limited time
- Varying confidence with technology
- Limited grant-writing experience
- Need for plain English and practical next steps
- Concern about data privacy and AI accuracy

## Beta Goals

- Prove that organisations can create a useful profile without support.
- Prove that grant matches feel relevant enough to review.
- Prove that AI-assisted drafting helps users produce stronger first-draft answers.
- Learn where users lack confidence, context, or trust.
- Capture structured feedback from co-design partners.

## Golden User Journey

1. Signup or login
2. Create or update organisation profile
3. View matched grants
4. Open grant detail
5. Start an application draft workspace
6. Draft answers with AI assistance
7. Save and export draft content
8. Leave feedback on usefulness and accuracy

## Must-Have Features

### Signup And Login

- Email-based signup and login
- Clear signed-out and signed-in states
- Redirect users to their organisation profile after login where appropriate
- Protect organisation, match, and draft pages from unauthorised access

### Organisation Profile

- Capture organisation name, county, organisation type, activity areas, beneficiaries, funding needs, and previous grant experience
- Use clear labels and plain English helper text
- Validate required fields
- Allow users to save progress
- Store data against the signed-in user or use typed mock data where backend wiring is not ready

### Grant Matching

- Show a list of relevant grant opportunities based on the organisation profile
- Start with typed mock grant data if a live grant database is not ready
- Show match reasons in plain English
- Show basic filters such as county, activity area, deadline, and funding size where practical
- Include empty states when no strong matches are available

### Grant Detail

- Show funder name, programme name, deadline, funding amount, eligibility, supported activities, required documents, and application link
- Explain why the grant may fit the organisation
- Flag uncertainty where match data is incomplete
- Provide a clear action to start or continue an application draft

### Application Draft Workspace

- Let users create a draft for a selected grant
- Show common application sections such as project summary, need, activities, beneficiaries, outcomes, budget, organisation background, and sustainability
- Save draft answers
- Let users edit all AI-generated text
- Make progress visible

### AI-Assisted Answers

- Generate draft answers using the organisation profile, grant details, and user-provided project notes
- Keep AI output clearly editable
- Avoid pretending the answer is final or guaranteed to succeed
- Encourage users to review facts, figures, eligibility, and tone
- Do not send unnecessary sensitive data to AI services

### Save And Export

- Save organisation profiles and application drafts
- Export or copy draft answers in a format users can paste into funder portals
- Include basic timestamps or saved-state messaging

### Feedback

- Capture feedback from beta users inside the product or through a simple linked form
- Ask whether matches were relevant, answers were useful, and anything felt confusing or risky
- Allow free-text comments

## Should-Have Features

- More detailed organisation profile fields, such as staff count, volunteers, annual budget range, legal status, and contact details
- Grant shortlist or saved grants
- Draft version history or restore previous answer
- Confidence indicators for grant matches
- Deadline reminders or calendar export
- Basic onboarding checklist
- Admin view for reviewing beta feedback
- Better export formatting for Word or PDF

## Later Features

- Live grant ingestion from multiple sources
- Advanced eligibility checking
- Collaboration across multiple users in one organisation
- Funder-specific application templates
- Budget builder
- Document upload and analysis
- Automated policy or governance document suggestions
- Multi-language support
- CRM-style tracking across applications, funders, and outcomes
- Payment plans or subscription management

## Non-Goals For Beta

- Fully automated grant submission
- Guaranteeing funding success
- Replacing user review or board approval
- Building a large public grant marketplace
- Complex admin dashboards
- Real-time collaboration
- Handling highly sensitive casework or beneficiary personal data

## UX Principles

- Use calm, practical screens with clear next steps.
- Write for non-technical users.
- Avoid jargon where plain English works.
- Keep forms split into manageable sections.
- Show why a grant matched, not just that it matched.
- Make AI assistance feel like drafting support, not a black box.
- Let users stay in control of edits, saves, and exports.

## Data And Security Requirements

- Organisation data and draft answers must only be visible to authorised users.
- Every read and write of organisation-owned data must check ownership.
- Do not expose Supabase secrets or privileged keys in browser code.
- Do not log private organisation profile data or application draft content.
- Use fictional data for mocks, tests, and demos.
- AI requests should include only the data needed to produce the requested answer.

## Beta Success Signals

- Co-design partners can complete an organisation profile without help.
- Users understand why grants were recommended.
- Users can create a useful first draft faster than starting from a blank page.
- Users trust that they can edit and control AI-generated text.
- Feedback identifies specific improvements for matching, drafting, and export.

## Open Questions

- Which grant sources are reliable enough for beta matching?
- What minimum organisation profile fields create useful matches?
- What export format do users prefer first: copy-to-clipboard, Word, PDF, or structured text?
- How much AI explanation is useful without overwhelming users?
- What feedback questions will best support co-design partner interviews?
