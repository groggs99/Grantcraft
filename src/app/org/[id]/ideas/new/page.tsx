import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import IdeaBriefForm from '@/components/ideas/IdeaBriefForm'
import type { SaveIdeaData } from '@/types/ideas'

export const metadata = {
  title: 'New Project Idea — GrantCraft',
  description: 'Describe your project idea and generate a structured brief.',
}

export default async function NewIdeaPage({
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
    .select('id, name')
    .eq('id', id)
    .single()

  if (!org) redirect('/org/new')

  async function saveProjectIdea(data: SaveIdeaData) {
    'use server'
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('You must be signed in.')

    const { error } = await supabase.from('project_ideas').insert({
      org_id: data.orgId,
      user_id: user.id,
      raw_idea: data.rawIdea,
      brief: data.brief,
      status: 'draft',
    })

    if (error) throw new Error(error.message)
  }

  return (
    <IdeaBriefForm
      orgId={org.id}
      orgName={org.name}
      onSave={saveProjectIdea}
    />
  )
}
