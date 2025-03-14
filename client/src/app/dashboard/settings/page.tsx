import { getUser } from "@/utils/supabase/server";
import Settings from "@/components/ui/Settings";
import { Suspense } from "react";

export default async function SettingsPage() {
  const user = await getUser();
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Settings user={user} />
    </Suspense>
);
} 
