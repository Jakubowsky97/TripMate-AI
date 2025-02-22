import { getUser } from "@/utils/supabase/server";
import Dashboard from "@/components/ui/Dashboard";

export default async function DashboardPage() {
  const user = await getUser();
  return <Dashboard user={user} />;
} 
