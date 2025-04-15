import { getUser } from "@/utils/supabase/server";
import Settings from "@/components/ui/Settings";
import { Suspense } from "react";
import { checkSessionOrRedirect } from "@/app/auth/actions";

export default async function SettingsPage() {
  const access_token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const refresh_token =
    typeof window !== "undefined"
      ? localStorage.getItem("refresh_token")
      : null;

  await checkSessionOrRedirect({
    accessToken: access_token || "",
    refreshToken: refresh_token || "",
  });

  const user = await getUser();
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Settings user={user} />
    </Suspense>
  );
}
