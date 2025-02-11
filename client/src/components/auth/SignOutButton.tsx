"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient(); 

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/");
    }
  }

  return <button onClick={handleSignOut}>Sign out</button>;
}
