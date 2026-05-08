import OrgProfileForm from '@/components/org/OrgProfileForm'
import type { OrgProfileFormData } from '@/types/org'

async function saveOrgProfile(data: OrgProfileFormData) {
  'use server'
  // TODO: persist to Supabase
  console.log('[GrantCraft] saveOrgProfile stub:', data.name)
}

export const metadata = {
  title: 'Create Organisation Profile — GrantCraft',
  description: 'Set up your organisation profile to start finding grants.',
}

export default function NewOrgPage() {
  return (
    <OrgProfileForm onSave={saveOrgProfile} />
  )
}
