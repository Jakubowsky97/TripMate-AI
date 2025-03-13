import { getSession, getUser } from "@/utils/supabase/server";
import Dashboard from "@/components/ui/Dashboard";

export default async function DashboardPage() {
  const user = await getUser();
  const session = await getSession();
  return <Dashboard user={user} access_token={session?.access_token || ''} refresh_token={session?.refresh_token || ''} />;
} 
