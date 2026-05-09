'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(
  _prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return error.message
  redirect('/org/new')
}

export async function signUp(
  _prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return error.message
  redirect('/org/new')
}
