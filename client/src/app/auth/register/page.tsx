import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()
  if (data?.user) {
    redirect('/dashboard?user_id=' + data.user.id)
  }
  redirect("/auth/register/step-1");
}
