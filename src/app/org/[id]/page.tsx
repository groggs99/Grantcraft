import OrgProfileForm from '@/components/org/OrgProfileForm'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import type { OrgProfileFormData } from '@/types/org'

export const metadata = {
  title: 'Organisation Profile — GrantCraft',
  description: 'View and update your organisation profile.',
}

export default async function OrgProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/auth')

  const { data: org } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!org) notFound()

  const initialData: OrgProfileFormData = {
    name: org.name,
    legalName: org.legal_name ?? undefined,
    orgType: org.org_type,
    charityNumber: org.charity_number ?? undefined,
    companyNumber: org.company_number ?? undefined,
    taxExemptionRef: org.tax_exemption_ref ?? undefined,
    yearFounded: org.year_founded,
    description: org.description,
    mission: org.mission,
    website: org.website ?? undefined,
    addressLine1: org.address_line1,
    addressLine2: org.address_line2 ?? undefined,
    town: org.town,
    county: org.county,
    eircode: org.eircode ?? undefined,
    setting: org.setting,
    geographicReach: org.geographic_reach,
    contactName: org.contact_name,
    contactRole: org.contact_role,
    contactEmail: org.contact_email,
    contactPhone: org.contact_phone ?? undefined,
    staffCount: org.staff_count,
    volunteerCount: org.volunteer_count,
    budgetRange: org.budget_range,
    activityAreas: org.activity_areas ?? [],
    targetDemographics: org.target_demographics ?? [],
    hasGrantExperience: org.has_grant_experience,
    previousGrantsDetail: org.previous_grants_detail ?? undefined,
    largestGrantReceived: org.largest_grant_received ?? undefined,
    grantWritingCapacity: org.grant_writing_capacity,
    projectFundingNeed: org.project_funding_need ?? '',
    estimatedFundingAmount: org.estimated_funding_amount ?? '',
    fundingCategory: org.funding_category ?? 'not-sure',
    biggestGrantChallenge: org.biggest_grant_challenge ?? '',
  }

  async function updateOrgProfile(data: OrgProfileFormData) {
    'use server'

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('You must be signed in.')
    validateBetaProfile(data)

    const { error } = await supabase
      .from('organisations')
      .update({
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
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw new Error(error.message)
  }

  return <OrgProfileForm initialData={initialData} onSave={updateOrgProfile} />
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
