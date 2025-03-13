import { getUser } from "@/utils/supabase/server";
import Settings from "@/components/ui/Settings";

export default async function SettingsPage() {
  const user = await getUser();
  return <Settings user={user} />;
} 
