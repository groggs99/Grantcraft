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

    const { data: upserted, error } = await supabase.from('organisations').upsert({
      user_id: user.id,
      name: data.name,
      legal_name: data.legalName,
      org_type: data.orgType,
      charity_number: data.charityNumber,
      company_number: data.companyNumber,
      tax_exemption_ref: data.taxExemptionRef,
      year_founded: data.yearFounded,
      description: data.description,
      mission: data.mission,
      website: data.website,
      address_line1: data.addressLine1,
      address_line2: data.addressLine2,
      town: data.town,
      county: data.county,
      eircode: data.eircode,
      setting: data.setting,
      geographic_reach: data.geographicReach,
      contact_name: data.contactName,
      contact_role: data.contactRole,
      contact_email: data.contactEmail,
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
    }, { onConflict: 'user_id' }).select('id').single()

    if (error) throw new Error(error.message)

    redirect(`/org/${upserted!.id}/ideas/new`)
  }

  return <OrgProfileForm onSave={saveOrgProfile} />
}
