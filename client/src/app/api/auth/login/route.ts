import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json({ error: error?.message ?? "Unauthorized" }, { status: 401 });
  }

  const accessToken = data.session.access_token;

  // 🔐 Ustawiamy token jako ciasteczko
  const response = NextResponse.json({ access_token: accessToken });

  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 dzień
  });

  response.headers.set("X-user-id", data.user.id); 
  return response;
}
