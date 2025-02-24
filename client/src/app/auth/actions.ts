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

  const { data: signinData, error } = await supabase.auth.signInWithPassword(dataUser)

  if (error) {
    redirect('/error')
  }

    const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: dataUser.email,
            password: dataUser.password,
        }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Login failed");
    }

  redirect('/dashboard?user_id=' + signinData?.user?.id);
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  if(formData.get('password') != formData.get('confirmPassword')) {
    redirect('/error')
  }
  console.log("Password Matched")

  const fullName = `${formData.get('fname')} ${formData.get('lname')}`

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const dataUser = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: fullName,
        email: formData.get('email') as string,
      }
    }
  }

  const { data, error } = await supabase.auth.signUp(dataUser)

  if (error) {
    redirect('/error')
  }

  redirect('/auth/register/step-3?user_id=' + data?.user?.id);
}

export async function resendEmailVerification(formData: FormData) { 
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: formData.get('email') as string,
  })
  
  if (error) {
    redirect('/auth/register/step-3?error=' + error.message.replace(/ /g, '+'));
  }

  redirect('/auth/register/step-3');
}

export async function sendResetPassword(email: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `http://localhost:3000/auth/reset-password`,
  });

  if (error) {
      return{ error };
  }
  return { data };
}