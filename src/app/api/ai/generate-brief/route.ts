import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Static system prompt — cached across repeated calls (same prefix = cache hit)
const SYSTEM_PROMPT = `You are an expert grant writing consultant specialising in the Irish non-profit sector. You have deep knowledge of Irish funding programmes, the Community Foundation for Ireland, Rethink Ireland, Pobal, the Department of Rural and Community Development, Dormant Accounts, county council schemes, and European structural funds available to Irish organisations.

Your task is to transform a raw project idea into a structured, compelling project brief suitable for grant applications. The brief should be evidence-based, realistic, and aligned with the organisation's existing mission and demonstrated capacity.

You MUST respond with ONLY a valid JSON object — no preamble, no explanation, no markdown fences. The JSON must contain exactly these 7 string fields:

{
  "projectTitle": "A clear, concise project title (5-10 words)",
  "needStatement": "An evidence-based statement of the problem or need, referencing the Irish context where relevant",
  "proposedActivities": "The specific, concrete activities and interventions planned, in active voice",
  "targetBeneficiaries": "Who will directly benefit, an estimated number, and how they will be reached",
  "expectedOutcomes": "3-5 measurable outcomes and impacts using outcome-focused language",
  "estimatedBudgetRange": "A realistic cost range with brief rationale covering key cost heads (staffing, training, equipment, overhead)",
  "sustainabilityPlan": "How the project will continue or its impacts be maintained beyond the initial grant funding"
}

Use Irish English throughout. Be specific, realistic, and calibrated to what the organisation can credibly deliver given its stated capacity.`

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 })
  }

  let orgId: string
  let rawIdea: string
  try {
    const body = await request.json()
    orgId = body.orgId
    rawIdea = body.rawIdea
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!orgId || !rawIdea?.trim()) {
    return Response.json({ error: 'orgId and rawIdea are required' }, { status: 400 })
  }

  // RLS ensures the user can only fetch their own org
  const { data: org, error: orgError } = await supabase
    .from('organisations')
    .select('name, org_type, mission, description, activity_areas, target_demographics, geographic_reach, county, budget_range, has_grant_experience, grant_writing_capacity')
    .eq('id', orgId)
    .single()

  if (orgError || !org) {
    return Response.json({ error: 'Organisation not found' }, { status: 404 })
  }

  const orgContext = `Organisation: ${org.name}
Type: ${org.org_type}
County: ${org.county}
Geographic reach: ${org.geographic_reach}
Mission: ${org.mission}
Description: ${org.description}
Activity areas: ${org.activity_areas?.join(', ') || 'not specified'}
Target demographics: ${org.target_demographics?.join(', ') || 'not specified'}
Annual budget range: ${org.budget_range}
Has previous grant experience: ${org.has_grant_experience ? 'Yes' : 'No'}
Grant writing capacity: ${org.grant_writing_capacity}`

  let message: Awaited<ReturnType<typeof anthropic.messages.create>>
  try {
    message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Organisation profile:\n${orgContext}\n\nProject idea:\n${rawIdea.trim()}`,
        },
      ],
    })
    console.log('[generate-brief] Anthropic call succeeded — stop_reason:', message.stop_reason, '| content blocks:', message.content.length)
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error('[generate-brief] Anthropic API error — status:', err.status, '| message:', err.message, '| error:', err)
      return Response.json({ error: 'AI service error — please try again shortly' }, { status: 502 })
    }
    console.error('[generate-brief] Unexpected error calling Anthropic:', err)
    return Response.json({ error: 'Failed to call AI service' }, { status: 500 })
  }

  const block = message.content[0]
  console.log('[generate-brief] First content block type:', block?.type)
  if (!block || block.type !== 'text') {
    console.error('[generate-brief] Unexpected content block:', JSON.stringify(message.content))
    return Response.json({ error: 'Unexpected response from AI' }, { status: 500 })
  }

  const rawText = block.text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim()
  console.log('[generate-brief] Raw text from Claude (first 200 chars):', rawText.slice(0, 200))
  try {
    const brief = JSON.parse(rawText)
    return Response.json({ brief })
  } catch (err) {
    console.error('[generate-brief] JSON.parse failed:', err)
    console.error('[generate-brief] Full raw text:', rawText)
    return Response.json({ error: 'AI returned invalid JSON — please try again' }, { status: 500 })
  }
}
