import { SignInForm } from "@/components/auth/SignInForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()
  if (data?.user) {
    redirect('/dashboard?user_id=' + data.user.id)
  }
  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <div className="w-1/3 bg-[#f9fbfc] shadow-md p-6 hidden lg:block">
        <h1 className="text-2xl font-bold mb-4">TripMate AI</h1>
      </div>

      {/* Signin Form */}
      <div className="flex-1 flex flex-col items-center justify-center">
          <SignInForm/>
      </div>
    </div>
  );
}