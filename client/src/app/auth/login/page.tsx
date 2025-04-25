import { SignInForm } from "@/components/auth/SignInForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()
  if (data?.user) {
    redirect('/dashboard')
  }
  return (
    <div className="min-h-screen flex bg-white">      
      <div className="flex-1 flex flex-col justify-center items-center relative">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-[url(/img/background/loginBg.jpg)] bg-cover bg-center opacity-25 z-0" />

        {/* Signin Form */}
        <div className="z-10">
          <SignInForm/>
        </div>
      </div>
    </div>
  );
}