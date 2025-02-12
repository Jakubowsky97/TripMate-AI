'use server'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const dataUser = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data, error } = await supabase.auth.signInWithPassword(dataUser)

  if (error) {
    redirect('/error')
  }

  redirect('/dashboard?user_id=' + data?.user?.id);
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  if(formData.get('password') != formData.get('confirmPassword')) {
    redirect('/error')
  }
  console.log("Password Matched")

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const dataUser = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data, error } = await supabase.auth.signUp(dataUser)

  if (error) {
    redirect('/error')
  }

  redirect('/auth/register/step-3?user_id=' + data?.user?.id);
}