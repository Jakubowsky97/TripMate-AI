"use server";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  if (formData.get("password") != formData.get("confirmPassword")) {
    redirect("/error");
  }
  console.log("Password Matched");

  const fullName = `${formData.get("fname")} ${formData.get("lname")}`;

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const dataUser = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: fullName,
        email: formData.get("email") as string,
      },
    },
  };

  const { data, error } = await supabase.auth.signUp(dataUser);

  if (error) {
    redirect("/error");
  }
  return data;
}

export async function resendEmailVerification(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: formData.get("email") as string,
  });

  if (error) {
    redirect("/auth/register/step-3?error=" + error.message.replace(/ /g, "+"));
  }

  redirect("/auth/register/step-3");
}

export async function sendResetPassword(email: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_PAGE_URL}/auth/reset-password`,
  });

  if (error) {
    return { error };
  }
  return { data };
}

export const logout = async () => { 
  const supabase = await createClient();

  const cookieStore = await cookies()
  cookieStore.delete('access_token');

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  redirect("/auth/login");
}