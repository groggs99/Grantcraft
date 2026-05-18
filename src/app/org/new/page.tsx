import OrgProfileForm from '@/components/org/OrgProfileForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { OrgProfileFormData } from '@/types/org'

export const metadata = {
  title: 'Create Organisation Profile — GrantCraft',
  description: 'Set up your organisation profile to start finding grants.',
}

export default async function NewOrgPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: existing } = await supabase
      .from('organisations')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existing) redirect(`/org/${existing.id}`)
  }

  async function saveOrgProfile(data: OrgProfileFormData) {
    'use server'

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('You must be signed in to save a profile.')
    validateBetaProfile(data)

    const { data: upserted, error } = await supabase.from('organisations').upsert({
      user_id: user.id,
      name: data.name.trim(),
      legal_name: data.legalName,
      org_type: data.orgType,
      charity_number: data.charityNumber,
      company_number: data.companyNumber,
      tax_exemption_ref: data.taxExemptionRef,
      year_founded: data.yearFounded,
      description: data.description.trim(),
      mission: data.mission.trim() || data.description.trim(),
      website: data.website,
      address_line1: data.addressLine1.trim() || data.town.trim(),
      address_line2: data.addressLine2,
      town: data.town.trim(),
      county: data.county,
      eircode: data.eircode,
      setting: data.setting,
      geographic_reach: data.geographicReach,
      contact_name: data.contactName || 'Profile owner',
      contact_role: data.contactRole || 'Profile owner',
      contact_email: data.contactEmail || user.email || '',
      contact_phone: data.contactPhone,
      staff_count: data.staffCount,
      volunteer_count: data.volunteerCount,
      budget_range: data.budgetRange,
      activity_areas: data.activityAreas,
      target_demographics: data.targetDemographics,
      has_grant_experience: data.hasGrantExperience,
      previous_grants_detail: data.previousGrantsDetail,
      largest_grant_received: data.largestGrantReceived,
      grant_writing_capacity: data.grantWritingCapacity,
      project_funding_need: data.projectFundingNeed.trim(),
      estimated_funding_amount: data.estimatedFundingAmount.trim(),
      funding_category: data.fundingCategory,
      biggest_grant_challenge: data.biggestGrantChallenge.trim(),
    }, { onConflict: 'user_id' }).select('id').single()

    if (error) throw new Error(error.message)

    redirect(`/org/${upserted!.id}/ideas/new`)
  }

  return <OrgProfileForm onSave={saveOrgProfile} />
}

function validateBetaProfile(data: OrgProfileFormData) {
  const requiredText = [
    data.name,
    data.town,
    data.description,
    data.projectFundingNeed,
    data.estimatedFundingAmount,
    data.biggestGrantChallenge,
  ]

  if (requiredText.some((value) => value.trim().length === 0)) {
    throw new Error('Please complete the required organisation profile fields.')
  }

  if (data.activityAreas.length === 0 || data.targetDemographics.length === 0) {
    throw new Error('Please choose an activity area and at least one audience served.')
  }

  const amount = Number(data.estimatedFundingAmount.replace(/[^\d.]/g, ''))
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Please enter a valid estimated funding amount.')
  }
}
